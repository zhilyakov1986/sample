using FluentValidation;
using FluentValidation.Results;
using Model;
using Service.Auth;
using Service.Utilities;
using System.Data.Entity;
using System.IO;
using System.Linq;
using Service.Common.Address;
using Service.Common.Phone;
using Service.Users.Access;
using Service.Users.Models;
using Service.Users.Phones;
using User = Model.User;
using System.Collections.Generic;

namespace Service.Users
{
    public class UserService : BaseService, IUserService
    {
        private const int ProfilePicSize = 1200;
        private const int ThumnailPicSize = 200;
        private readonly IAuthService _authService;
        private readonly IValidator<User> _userValidator;

        public UserService(IPrimaryContext context, IAuthService authService)
            : base(context)
        {
            _userValidator = new UserValidator(context);
            _authService = authService;
        }

        /// <summary>
        ///     Assigns a UserRole for User.
        /// </summary>
        public void AssignRole(int userId, int authUserId, int roleId)
        {
            if (userId == 0 || authUserId == 0 || roleId == 0)
            {
                var error = new ValidationFailure("Id", "Id cannot be 0");
                throw new ValidationException(new[] { error });
            }
            _authService.AssignRole(authUserId, roleId);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Creates User and accompanying AuthUser.
        /// </summary>
        public void Create(User user, string username, string password, int userRoleId, bool sendEmail = false)
        {
            bool genPassword = string.IsNullOrEmpty(password);
            ThrowIfNull(user);

            user.AuthUser = _authService.GenerateAuthUser(username, genPassword, password, userRoleId);
            _authService.ValidateAndThrow(user.AuthUser);
            ValidateAndThrow(user, _userValidator);
            Context.Users.Add(user);
            Context.SaveChanges();
            if (sendEmail) SendInitialUserEmail(user, genPassword);
        }

        /// <summary>
        ///     Creates new Address and associates to User.
        /// </summary>
        public CreateAddressResult CreateAddress(int userId, Address address)
        {
            return base.CreateAddress<User>(userId, address);
        }

        /// <summary>
        ///     Creates a Document, writes to disk, and associated to User.
        /// </summary>
        public Document CreateDocument(int userId, string fileName, byte[] docBytes, int uploadedBy)
        {
            Document doc = CreateDocument<User>(userId, fileName, docBytes, uploadedBy, new DocumentValidator());
            return doc;
        }

        private User GetUserForDelete(int userId)
        {
            return Context.Users
                .Include(u => u.AuthUser)
                .Include(u => u.AuthUser.AuthTokens)
                .Include(u => u.Documents)
                .Include(u => u.Documents_UploadedBy)
                .Include(u => u.Image)
                .Include(u => u.UserPhones)
                .SingleOrDefault(u => u.Id == userId);
        }

        /// <summary>
        ///     Deletes User, AuthTokens, AuthUser, and Image records.
        /// </summary>
        /// <param name="userId"></param>
        public int Delete(int userId)
        {
            // NOTE: there is an issue where removing the AuthTokens
            // under the User's AuthUser actually nulls out other object refs
            // under the User. Take care to preserve ordering and remove
            // the AuthTokens and AuthUser last.
            var user = GetUserForDelete(userId);
            ThrowIfNull(user);
            if (!user.AuthUser.IsEditable)
                throw new ValidationException("This is a protected user and cannot be deleted.");
            int authId = user.AuthUserId; // need to preserve so we can return for RoleManager
            Image img = RemoveImage(user);
            if (user.AddressId != null)
            {
                var addr = Spoof<Address>(user.AddressId.Value);
                user.AddressId = null;
                user.Address = null;
                Context.Addresses.Attach(addr);
                Context.Addresses.Remove(addr);
            }
            Context.Documents.RemoveRange(user.Documents);
            foreach (var d in user.Documents_UploadedBy)
                d.UploadedBy = null;
            Context.AuthTokens.RemoveRange(user.AuthUser.AuthTokens);
            Context.AuthUsers.Remove(user.AuthUser);
            Context.Users.Remove(user);
            Context.SaveChanges();
            DeleteDiskImages(img); // only delete if successful
            return authId;
        }

        /// <summary>
        ///     Deletes the Address of a User.
        /// </summary>
        /// <param name="userId"></param>
        public void DeleteAddress(int userId)
        {
            base.DeleteAddress<User>(userId);
        }

        /// <summary>
        ///     Deletes a doc from a User and disk.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="docId"></param>
        public void DeleteDocument(int userId, int docId)
        {
            DeleteDocument<User>(userId, docId);
        }

        /// <summary>
        ///     Deletes a image from a User.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Returns a new rowversion for the User.</returns>
        public byte[] DeleteImage(int userId)
        {
            var user = Context.Users
                .Include(u => u.Image)
                .SingleOrDefault(u => u.Id == userId);
            ThrowIfNull(user);
            Image img = RemoveImage(user);
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            DeleteDiskImages(img);
            // ReSharper disable once PossibleNullReferenceException
            return user.Version;
        }


        /// <summary>
        ///     Changes whether a User has access to the portal.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="hasAccess"></param>
        /// <returns>Returns the AuthUserId of the User that was updated.</returns>
        public int SetHasAccess(int userId, bool hasAccess)
        {
            var user = Context.Users.
                Include(u => u.AuthUser)
                .SingleOrDefault(u => u.Id == userId);
            ThrowIfNull(user);
            // ReSharper disable once PossibleNullReferenceException
            if (!user.AuthUser.IsEditable)
                throw new ValidationException("This is a protected user and cannot be edited.");

            user.AuthUser.HasAccess = hasAccess;
            Context.SetEntityState(user.AuthUser, EntityState.Modified);
            Context.SaveChanges();
            return user.AuthUserId;
        }

        /// <summary>
        ///     Triggers underlying AuthUser's forgot password functionality
        ///     with the User's email.
        ///     AuthUser must be present.
        /// </summary>
        /// <param name="email"></param>
        public void ForgotPassword(string email)
        {
            var user = Context.Users.Include(u => u.AuthUser).Where(u => u.AuthUser.IsEditable).SingleOrDefault(u => u.Email == email);
            ThrowIfNull(user);
            // ReSharper disable once PossibleNullReferenceException
            _authService.SetResetKey(user.AuthUser);
            _authService.SendForgotPasswordEmail(user.AuthUser, user.Email);
        }

        /// <summary>
        ///     Gets a User by AuthUserId. This allows us
        ///     to return some user info on login.
        /// </summary>
        /// <param name="authId"></param>
        /// <returns>Returns a User, or null if not found.</returns>
        public User GetByAuthUserId(int authId)
        {
            return Context.Users
                .Include(u => u.AuthUser)
                .Include(u => u.Image)
                .AsNoTracking() // prevent ref loop
                .SingleOrDefault(u => u.AuthUserId == authId);
        }

        /// <summary>
        ///     Gets a user by email.
        ///     For use generally with forgot password.
        /// </summary>
        /// <param name="email"></param>
        /// <returns>Returns a User, or null if not found.</returns>
        public User GetByEmail(string email)
        {
            return Context.Users
                .Include(u => u.AuthUser)
                .SingleOrDefault(u => u.Email == email);
        }

        /// <summary>
        ///     Gets user with profile pic.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Returns a User, or null if not found.</returns>
        public User GetById(int userId)
        {
            return Context.Users
                .Include(u => u.Address)
                .Include(u => u.AuthUser)
                .Include(u => u.AuthUser.UserRole)
                .Include(u => u.Image)
                .Include(u => u.UserPhones)
                //.Where(u => u.AuthUser.IsEditable) // EDIT: allow internal user so we can land on profile page, though Authuser is non-editable
                .SingleOrDefault(u => u.Id == userId);
        }

        /// <summary>
        ///     Gets all Documents for a User.
        /// </summary>
        /// <returns>Returns an IQueryable of Documents.</returns>
        public IQueryable<Document> GetUserDocuments(int userId)
        {
            return Context.Users
                .Where(u => u.Id == userId)
                .SelectMany(u => u.Documents);
        }

        /// <summary>
        ///     Gets all Users.
        /// </summary>
        /// <returns>Returns an IQueryable of Users.</returns>
        public IQueryable<User> GetUsers()
        {
            return Context.Users
                .Include(u => u.Address)
                .Include(u => u.AuthUser)
                .Include(u => u.AuthUser.UserRole)
                .Include(u => u.Image)
                .Include(u => u.UserPhones)
                .Where(u => u.AuthUser.IsEditable); // hide internal users
        }

        /// <summary>
        ///     Merges UserPhones.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="phones"></param>
        public void MergePhones(int userId, PhoneCollection<UserPhone> phones)
        {
            ThrowIfNull(phones);
            ValidateAndThrow(phones, new UserPhoneCollectionValidator()); //  validate phones that will persist

            if (phones.Phones != null)
            {
                foreach (var p in phones.Phones)
                {
                    p.PhoneType = null; // clean out PhoneType if present for adds
                    p.UserId = userId; // in case it wasn't set...
                }
            }

            var existing = Context.UserPhones.Where(up => up.UserId == userId);
            Context.Merge<UserPhone>()
                .SetExisting(existing)
                .SetUpdates(phones.Phones)
                .MergeBy((e, u) => e.Phone == u.Phone && e.Extension == u.Extension)
                .MapUpdatesBy((e, u) =>
                {
                    e.IsPrimary = u.IsPrimary;
                    e.PhoneTypeId = u.PhoneTypeId;
                })
                .Merge();
            Context.SaveChanges();
        }

        /// <summary>
        ///     Reloads the user entity for concurrency handling.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns>Returns a User.</returns>
        public User Reload(int userId)
        {
            return Context.Users
                .Include(u => u.Address)
                .Include(u => u.AuthUser)
                .Include(u => u.AuthUser.UserRole)
                .Include(u => u.Image)
                .Include(u => u.UserPhones)
                .Where(u => u.AuthUser.IsEditable) // hide internal users
                .AsNoTracking()
                .SingleOrDefault(u => u.Id == userId);
        }

        /// <summary>
        ///     Updates an Address of a User.
        /// </summary>
        public new void UpdateAddress(Address address)
        {
            base.UpdateAddress(address);
        }

        /// <summary>
        ///     Updates the user's profile pic.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="picBytes"></param>
        /// <param name="fileName"></param>
        /// <returns>Returns the new User rowversion and the Image record.</returns>
        public UpdateUserPicResult UpdatePic(int userId, byte[] picBytes, string fileName)
        {
            var user = Context.Users
                .Include(u => u.Image)
                .AsNoTracking()
                .Single(u => u.Id == userId);
            ThrowIfNull(user);
            string ext = fileName?.Split('.').Last();
            CheckImageExtOrThrow(ext);
            Image oldImg = RemoveImage(user);
            user.Image = GeneratePicRecord(ext, fileName);
            WriteProfilePicToDisk(user.Image, picBytes);
            Context.Images.Add(user.Image);
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            DeleteDiskImages(oldImg);
            return new UpdateUserPicResult
            {
                Version = user.Version,
                Image = user.Image
            };
        }

        /// <summary>
        ///     Updates a User's PortalAccess features, e.g.
        ///     Username and UserRole.
        ///     NOTE: this method must return the AuthUserId of the edited user,
        ///     so that anything requiring an access change can handle it for the
        ///     appropriate AuthUser.
        /// </summary>
        public UpdatePortalAccessResult UpdatePortalAccess(int userId, PortalAccessUpdater updater)
        {
            ThrowIfNull(updater);
            ValidateAndThrow(updater, new PortalAccessUpdaterValidator());
            var user = Context.Users
                .Include(u => u.AuthUser)
                .SingleOrDefault(u => u.Id == userId);
            ThrowIfNull(user);
            // ReSharper disable once PossibleNullReferenceException
            if (!user.AuthUser.IsEditable)
                throw new ValidationException("This is a protected user and cannot be edited");
            user.AuthUser.Username = updater.Username;
            user.AuthUser.RoleId = updater.UserRoleId;
            Context.SetEntityState(user.AuthUser, EntityState.Modified);
            Context.SaveChanges();
            var res = new UpdatePortalAccessResult
            {
                Version = user.Version,
                AuthUserId = user.AuthUserId
            };
            return res;
        }

        /// <summary>
        ///     Updates a user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns>Returns the new rowversion of the user.</returns>
        public byte[] UpdateUser(User user)
        {
            ThrowIfNull(user);
            user.AuthUser = null;
            user.Address = null;
            ValidateAndThrow(user, _userValidator);
            Context.Users.Attach(user);
            //Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            return user.Version;
        }

        private static void CheckImageExtOrThrow(string ext)
        {
            if (ImageProcessing.IsValidImageExt(ext))
                return;

            var vex = new ValidationException("Invalid image extension.") {Source = "Image"};
            throw vex;
        }

        private static void DeleteDiskImages(Image img)
        {
            if (img == null) return;
            File.Delete(ImageProcessing.PrependImageFolder(img.ImagePath));
            File.Delete(ImageProcessing.PrependImageFolder(img.ThumbnailPath));
        }

        private static Image GeneratePicRecord(string extension, string fileName)
        {
            extension = DocHelper.CheckExtensionDot(extension);
            var baseName = DocHelper.CreateDocFileBaseName();
            var pic = new Image
            {
                Name = fileName,
                ImagePath = baseName + extension,
                ThumbnailPath = baseName + "_thumb" + extension
            };
            return pic;
        }

        private static void WriteProfilePicToDisk(Image image, byte[] picBytes)
        {
            byte[] squarePic = ImageProcessing.CropImageToSquare(picBytes);
            byte[] mainPic = ImageProcessing.ResizeImage(squarePic, ProfilePicSize, ProfilePicSize);
            byte[] thumbPic = ImageProcessing.ResizeImage(squarePic, ThumnailPicSize, ThumnailPicSize);
            ImageProcessing.WriteImageToFile(mainPic, ImageProcessing.PrependImageFolder(image.ImagePath));
            ImageProcessing.WriteImageToFile(thumbPic, ImageProcessing.PrependImageFolder(image.ThumbnailPath));
        }

        private Image RemoveImage(User user)
        {
            if (user.Image == null) return null;
            Image img = user.Image.ShallowCopy();
            Context.Images.Attach(user.Image);
            Context.Images.Remove(user.Image);
            user.ImageId = null;
            user.Image = null;
            return img;
        }

        private void SendInitialUserEmail(User user, bool needsResetKey)
        {
            if (needsResetKey)
            {
                _authService.SetResetKey(user.AuthUser, 1440);
                _authService.SendNewUserResetEmail(user.AuthUser, user.Email);
            }
            else
                _authService.SendNewUserInitEmail(user.AuthUser, user.Email);
        }

        /// <summary>
        ///  Get Simplified User for the filters
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Simplified<User>> GetSimplifiedUsers()
        {
            return Simplified<User>.FromEnum(Context.Users.AsEnumerable(), u => u.FirstName + " " + u.LastName);
        }
    }
}
