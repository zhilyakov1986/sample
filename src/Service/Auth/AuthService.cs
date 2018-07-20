using FluentValidation;
using Model;
using Service.Utilities;
using System;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Service.Auth.Validation;
using AuthClient = Model.AuthClient;
using AuthUser = Model.AuthUser;
using System.Threading.Tasks;
using Service.Auth.Models;

namespace Service.Auth
{
    public class AuthService : BaseService, IAuthService
    {
        private readonly AuthUserValidator _authValidator;

        public AuthService(IPrimaryContext context)
            : base(context)
        {
            _authValidator = new AuthUserValidator(this);
        }

        /// <summary>
        ///     Assigns a new role to an AuthUser.
        ///     NOTE: does NOT call SaveChanges, so as to be composable.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <param name="userRoleId"></param>
        public void AssignRole(int authUserId, int userRoleId)
        {
            var authUser = Context.AuthUsers.Find(authUserId);
            ThrowIfNull(authUser);
            // ReSharper disable once PossibleNullReferenceException
            if (!authUser.IsEditable)
                throw new ValidationException("This is a protected User and cannot be edited.");
            authUser.RoleId = userRoleId;
            Context.SetEntityState(authUser, EntityState.Modified);
        }

        /// <summary>
        ///      This is a maintenance task to remove any expired auth tokens from the db.
        /// </summary>
        private void ClearExpiredAuthTokens()
        {
            var tokensToClear = Context.AuthTokens.Where(at => at.ExpiresUtc <= DateTime.UtcNow);
            if (!tokensToClear.Any()) return;
            Context.AuthTokens.RemoveRange(tokensToClear);
            Context.SaveChanges();
        }

        /// <summary>
        ///      Creates a new AuthUser, given a username and password. Returns the new AuthUser's Id.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="userRoleId"></param>
        /// <returns>Returns the Id of the created AuthUser.</returns>
        public int Create(string username, string password, int userRoleId)
        {
            AuthUser au = GenerateAuthUser(username, false, password, userRoleId);
            Context.AuthUsers.Add(au);
            Context.SaveChanges();
            return au.Id;
        }

        /// <summary>
        ///      Saves a refresh token record. Returns the guid to send back to user.
        /// </summary>
        /// <param name="userId">      </param>
        /// <param name="authClientId"></param>
        /// <param name="issuedUtc">   </param>
        /// <param name="tokenMinutes"></param>
        /// <param name="jwt">         </param>
        /// <returns>Returns a Guid that acts as a key for the saved refresh token.</returns>
        public Guid CreateToken(int userId, int authClientId, DateTime issuedUtc, int tokenMinutes, string jwt)
        {
            var g = Guid.NewGuid();
            var token = CreateTokenRecord(userId, authClientId, g, issuedUtc, tokenMinutes, jwt);
            Context.AuthTokens.Add(token);
            Context.SaveChanges();

            // JJG:
            // Remove range does not work inside of an async task because it dumps the context.  For now I
            // thinks it's better to have this here and just wait.  If it runs every login then we shouldn't
            // have to wait to long.  Wrapping it in a try catch so that at least logins won't bomb if there
            // is a problem.
            try {
                ClearExpiredAuthTokens();
            }
            catch (Exception) {
                // ignored
            }


            return g;
        }

        /// <summary>
        ///      Creates an AuthUser without saving, for use with other entities.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="generatePassword"></param>
        /// <param name="password"></param>
        /// <param name="userRoleId"></param>
        /// <returns>Returns a new AuthUser.</returns>
        public AuthUser GenerateAuthUser(string username, bool generatePassword, string password, int userRoleId)
        {
            return DoGenerateAuthUser(username, generatePassword, password, userRoleId);
        }

        /// <summary>
        ///     Gets an AuthUser by Id.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <returns></returns>
        public AuthUser GetById(int authUserId)
        {
            return Context.AuthUsers.Find(authUserId);
        }

        /// <summary>
        ///     Gets an AuthUser by Id with Claims info
        ///     needed for login results.
        /// </summary>
        /// <param name="authUserId"></param>
        /// <returns>Returns an AuthUser with UserRole and Claims.</returns>
        public AuthUser GetByIdForLogin(int authUserId)
        {
            //Admin user may not HasAccess if AllowAdminDirectLogin is false on the SQL project publish
            //this is by design so that the Admin user cannot be compromised in a live environment
            return Context.AuthUsers
                .Include(au => au.UserRole)
                .Include(au => au.UserRole.UserRoleClaims)
                .SingleOrDefault(au => au.Id == authUserId && (au.Id == (int)ProtectedAuthUsers.AdminUser || au.HasAccess));
        }

        /// <summary>
        ///      Gets an AuthUser by username. This is useful when we use email's as usernames, esp.
        ///      during Forgot Password methods.
        /// </summary>
        /// <param name="username"></param>
        /// <returns>Returns an AuthUser found by username, or null.</returns>
        public AuthUser GetByUsername(string username)
        {
            return Context.AuthUsers.SingleOrDefault(a => a.Username == username);
        }

        /// <summary>
        ///      Checks username for uniqueness. This can be chained in the Must extension overload
        ///      for Fluent Validation, which accepts the entity itself as the first parameter if you
        ///      need to use another field in your logic.
        /// </summary>
        /// <param name="user">    </param>
        /// <param name="username"></param>
        /// <returns></returns>
        public bool IsUniqueUsername(AuthUser user, string username)
        {
            return !Context.AuthUsers.Any(au => au.Username == username && au.Id != user.Id);
        }

        /// <summary>
        ///      Removes AuthTokens from Context.
        ///      NOTE: this will ultimately retrieve and enumerate the collection, which is a current
        ///            limitation of EF. If performance becomes an issue, consider replacing this method.
        /// </summary>
        /// <param name="authUserId"></param>
        public void RemoveAuthTokensByAuthUser(int authUserId)
        {
            var range = Context.AuthTokens.Where(at => at.AuthUserId == authUserId);
            Context.AuthTokens.RemoveRange(range);
        }

        /// <summary>
        ///      Removes a token from the context, based on token identifier.
        /// </summary>
        /// <param name="userId">           </param>
        /// <param name="authClientId">     </param>
        /// <param name="tokenIdentitifier"></param>
        public void RemoveToken(int userId, int authClientId, string tokenIdentitifier)
        {
            var token = RetrieveToken(userId, authClientId, tokenIdentitifier);
            if (token != null)
                Context.AuthTokens.Remove(token);
            Context.SaveChanges();
        }

        /// <summary>
        ///      Retrieves a token from the context by token identifier.
        /// </summary>
        /// <param name="userId">           </param>
        /// <param name="authClientId">     </param>
        /// <param name="tokenIdentitifier"></param>
        /// <returns>Returns a retrieved refresh token, or null if none found.</returns>
        public AuthToken RetrieveToken(int userId, int authClientId, string tokenIdentitifier)
        {
            var hash = Encryption.HashSha512(tokenIdentitifier);
            var token = Context.AuthTokens
                .Where(rt => rt.AuthUserId == userId && rt.AuthClientId == authClientId)
                .ToArray()
                .SingleOrDefault(rt => Encryption.GetSaltedHash(hash, rt.Salt).SequenceEqual(rt.IdentifierKey));
            return token;
        }

        /// <summary>
        ///     Sends an email to an authorized domain
        ///     for private single-use login as Admin User.
        /// </summary>
        /// <param name="email"></param>
        public void SendDomainEmailAccess(string email)
        {
            var au = Context.AuthUsers.Find((int)ProtectedAuthUsers.AdminUser);
            SetResetKey(au);
            // ReSharper disable once PossibleNullReferenceException
            string resetKey = HttpServerUtility.UrlTokenEncode(au.ResetKey);
            string from = AppSettings.GetDefaultEmailFrom();
            string link = CreateAdminAccessLink(resetKey);
            string bodyHTML = @"<div width=""546"" valign=""top"" style=""font-family:'Helvetica Neue',Helvetica,Arial,sans-serif!important;border-collapse:collapse"">
	                                <div style=""max-width:600px;margin:0 auto"">
		                                <h2 style=""color:#3c8ed7;line-height:30px;margin-bottom:12px;margin:0 0 12px"">Hello!</h2>
		                                <p style=""font-size:20px;line-height:26px;margin:0 0 16px"">
			                                You requested a sign in link for <b>{0}</b>. Click the button below to sign in.
		                                </p>
		                                <p style=""font-size:0.9rem;line-height:20px;margin:0 auto 1rem;color:#aaa;text-align:center;max-width:320px;word-break:break-word"">
			                                <a style=""color:#439fe0;font-weight:normal;text-decoration:none;word-break:break-word"" href=""{1}"" target=""_blank""></a>
		                                </p>
		                                <span style=""display:inline-block;border-radius:4px;background:#004AA0;border-bottom:2px solid #004AA0"">
				                                <a href=""{1}"" style=""color:white;font-weight:normal;text-decoration:none;word-break:break-word;font-size:20px;line-height:26px;border-top:14px solid;border-bottom:14px solid;border-right:32px solid;border-left:32px solid;background-color:#3c8ed7;border-color:#3c8ed7;display:inline-block;letter-spacing:1px;min-width:80px;text-align:center;border-radius:4px"" target=""_blank"">
					                                Sign in to {0}
				                                </a>
		                                </span>
		                                <p style=""font-size:12px;line-height:26px;margin:0 0 16px"">Note: Your link will expire in 24 hours.</p>
	                                </div>
                                </div>";
            // ReSharper disable once PossibleNullReferenceException
            string companyName = Context.Settings.Find((int)Settings.Settings.CompanyName).Value;
            string body = string.Format(bodyHTML,
                companyName, link);
            Email.SendEmail(from, email, "Link to access " + companyName, body);
        }

        /// <summary>
        ///      Generates a reset link and sends to auth user's designated email. For use when users
        ///      forget their passwords.
        /// </summary>
        /// <param name="user"> </param>
        /// <param name="email"></param>
        public void SendForgotPasswordEmail(AuthUser user, string email)
        {
            const string msgText = "Please use the following link to reset your password:";
            SendResetEmail(user, email, "Reset Password", msgText);
        }

        /// <summary>
        ///      Sends an invite email without a reset link.
        /// </summary>
        /// <param name="user"> </param>
        /// <param name="email"></param>
        public void SendNewUserInitEmail(AuthUser user, string email)
        {
            string msgText = $"A new account has been created for {user.Username}. " +
                             "You may use use this to sign in:";
            string from = AppSettings.GetDefaultEmailFrom();
            string link = CreateDefaultAdminSiteLink();
            const string title = "New Account Created";
            string body = $"{msgText}<br />{link}";
            Email.SendEmail(from, email, title, body);
        }

        /// <summary>
        ///      Generates a reset link and sets to auth user's designated email. For use on initial
        ///      creation of new users.
        /// </summary>
        /// <param name="user"> </param>
        /// <param name="email"></param>
        public void SendNewUserResetEmail(AuthUser user, string email)
        {
            string msgText = "A new account has been created for " + user.Username +
                ". Please use the following link within 24 hours to set up a password:";
            SendResetEmail(user, email, "New Account Created", msgText);
        }

        /// <summary>
        ///      Sets a new reset key for a user, good for 15 minutes by default.
        /// </summary>
        /// <param name="user">        </param>
        /// <param name="resetMinutes"></param>
        public void SetResetKey(AuthUser user, int resetMinutes = 15)
        {
            user.ResetKey = Encryption.GetSalt();
            user.ResetKeyExpirationUtc = DateTime.UtcNow.AddMinutes(resetMinutes);
            Update(user);
        }

        /// <summary>
        ///     Updates an AuthUser.
        /// </summary>
        /// <param name="authUser"></param>
        /// <returns>Returns the updated AuthUser.</returns>
        public AuthUser Update(AuthUser authUser)
        {
            ThrowIfNull(authUser);
            ValidateAndThrow(authUser, _authValidator);
            Context.SetEntityState(authUser, EntityState.Modified);
            Context.SaveChanges();
            return authUser;
        }
        /// <summary>
        ///      Updates a user's password.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns>Returns true unless an error occurs.</returns>
        public bool UpdatePassword(AuthUser user, string password)
        {
            ThrowIfNull(user);
            if (!user.IsEditable)
                throw new ValidationException("This is a protected user and cannot be edited.");
            ValidatePasswordStrength(password);
            var sh = new SaltedHashGenerator(password);
            user.Password = sh.SaltedHash;
            user.Salt = sh.Salt;
            Context.SetEntityState(user, EntityState.Modified);
            Context.SaveChanges();
            return true;
        }

        /// <summary>
        ///     Validates an AuthUser.
        /// </summary>
        /// <param name="user"></param>
        public void ValidateAndThrow(AuthUser user)
        {
            ValidateAndThrow(user, _authValidator);
        }

        /// <summary>
        ///     Validates an auth client. Returns the entity or null.
        /// </summary>
        /// <param name="authClientId">    </param>
        /// <param name="authClientSecret"></param>
        /// <returns>Returns a validated AuthClient, or null if validation failed.</returns>
        public AuthClient ValidateAuthClient(int authClientId, string authClientSecret)
        {
            var authClient = Context.AuthClients.Find(authClientId);
            return (AuthClient)CheckVerifiableByPassword(authClient, authClientSecret);
        }

        /// <summary>
        ///     Validates key from reset link for an
        ///     accepted domain email login.
        /// </summary>
        /// <param name="resetKey"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateDomainEmailLogin(string resetKey)
        {
            return ValidateReset((int)ProtectedAuthUsers.AdminUser, resetKey);
        }

        /// <summary>
        ///     Validates a username and password against the context.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateLogin(string username, string password)
        {
            var user = Context.AuthUsers
                .Include(au => au.UserRole)
                .Include(au => au.UserRole.UserRoleClaims)
                .SingleOrDefault(u => u.Username == username && u.HasAccess);
            if (user == null) return null;
            return (AuthUser)CheckVerifiableByPassword(user, password);
        }

        /// <summary>
        ///     Overload that accepts userId instead of username. Useful when validating user before
        ///     updating a password.
        /// </summary>
        /// <param name="userId">  </param>
        /// <param name="password"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateLogin(int userId, string password)
        {
            AuthUser user = GetByIdForLogin(userId);
            return (AuthUser)CheckVerifiableByPassword(user, password);
        }

        /// <summary>
        ///     Accepts reset key. Used during forgot password.
        /// </summary>
        /// <param name="userId">  </param>
        /// <param name="resetKey"></param>
        /// <returns>Returns a validated AuthUser, or null if validation failed.</returns>
        public AuthUser ValidateReset(int userId, string resetKey)
        {
            AuthUser user = GetByIdForLogin(userId);
            if (user == null) return null;
            byte[] keyBytes = HttpServerUtility.UrlTokenDecode(resetKey);
            return IsValidResetKey(user, keyBytes) ? user : null;
        }

        /// <summary>
        /// Flags a reset token as invalid once it has been redeemed
        /// </summary>
        /// <param name="authUserId"></param>
        public void MarkResetInvalid(int authUserId) {
            var authUser = GetById(authUserId);
            authUser.ResetKeyExpirationUtc = DateTime.UtcNow;
            Context.SaveChanges();
        }

        /// <summary>
        ///     Actually generates the AuthUser.
        ///     NOTE: this second, internal static method exists to make testing easier,
        ///     while the public instance method must be present to implement interface.
        /// </summary>
        /// <param name="username"></param>
        /// <param name="generatePassword"></param>
        /// <param name="password"></param>
        /// <param name="userRoleId"></param>
        /// <returns>Returns a new AuthUser.</returns>
        internal static AuthUser DoGenerateAuthUser(string username, bool generatePassword, string password, int userRoleId)
        {
            if (generatePassword) return DoGenerateAuthUser(username, userRoleId);
            ValidatePasswordStrength(password);
            var sh = new SaltedHashGenerator(password);
            return DoGenerateAuthUser(username, sh.SaltedHash, sh.Salt, userRoleId);
        }
        private static IVerifiable CheckVerifiableByPassword(IVerifiable authEntity, string password)
        {
            return IsCorrectPassword(authEntity, password) ? authEntity : null;
        }

        private static string CreateAdminAccessLink(string resetKey)
        {
            var adminSite = AppSettings.GetAdminSite();
            var endpoint = AppSettings.GetAdminAccessEndpoint();
            var href = $"{adminSite}{endpoint}?resetKey={resetKey}";
            return href;
        }

        private static string CreateDefaultAdminSiteLink()
        {
            return $@"<a href='{AppSettings.GetAdminSite()}'>Login</a>";
        }

        private static string CreateResetLink(AuthUser user, string resetKey)
        {
            var adminSite = AppSettings.GetAdminSite();
            var resetEndpoint = AppSettings.GetResetEndpoint();
            var href = $"{adminSite}{resetEndpoint}?resetKey={resetKey}&userId={user.Id}";
            return GenerateLink(href, "Reset Password");
        }

        private static AuthToken CreateTokenRecord(int userId, int authClientId, Guid g, DateTime issuedUtc, int tokenMinutes,
            string jwt)
        {
            var sh = new SaltedHashGenerator(g.ToString());
            return new AuthToken
            {
                IdentifierKey = sh.SaltedHash,
                Salt = sh.Salt,
                Id = userId,
                AuthClientId = authClientId,
                AuthUserId = userId,
                IssuedUtc = issuedUtc,
                ExpiresUtc = issuedUtc.AddMinutes(tokenMinutes),
                Token = jwt
            };
        }

        private static AuthUser DoGenerateAuthUser(string username, int userRoleId)
        {
            var salt = Encryption.GetSalt();
            var hash = Encryption.GetSalt();
            var sh = Encryption.GetSaltedHash(hash, salt);
            return DoGenerateAuthUser(username, sh, salt, userRoleId);
        }

        private static AuthUser DoGenerateAuthUser(string username, byte[] saltedHash, byte[] salt, int userRoleId)
        {
            return new AuthUser
            {
                Username = username,
                Password = saltedHash,
                Salt = salt,
                ResetKey = new byte[] { 0 },
                ResetKeyExpirationUtc = DateTime.UtcNow.AddMinutes(-5),
                RoleId = userRoleId,
                HasAccess = true
            };
        }

        private static string GenerateLink(string href, string text)
        {
            return $@"<a href='{href}'>{text}</a>";
        }

        private static bool IsCorrectPassword(IVerifiable authEntity, string password)
        {
            var hash = Encryption.HashSha512(password);
            return authEntity != null &&
                   Encryption.GetSaltedHash(hash, authEntity.Salt).SequenceEqual(authEntity.Password);
        }

        private static void ValidatePasswordStrength(string password)
        {
            if (ValidatorHelpers.BeAStrongPassword(password)) return;
            var ex = new ValidationException(RegexPatterns.PasswordErrorMsg) {Source = "Password"};
            throw ex;
        }

        private bool IsValidResetKey(AuthUser user, byte[] keyBytes)
        {
            return keyBytes != null &&
                keyBytes.SequenceEqual(user.ResetKey) &&
                user.ResetKeyExpirationUtc >= DateTime.UtcNow;
        }
        private void SendResetEmail(AuthUser user, string email, string title, string msgText)
        {
            string resetKey = HttpServerUtility.UrlTokenEncode(user.ResetKey);
            string from = AppSettings.GetDefaultEmailFrom();
            string link = CreateResetLink(user, resetKey);
            string body = $"{msgText}<br />{link}";
            Email.SendEmail(from, email, title, body);
        }
    }
}
