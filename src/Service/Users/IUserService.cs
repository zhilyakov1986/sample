using Model;
using System.Linq;
using Service.Common.Address;
using Service.Common.Phone;
using Service.Users.Access;
using Service.Users.Models;
using System.Collections.Generic;

namespace Service.Users
{
    public interface IUserService
    {
        void AssignRole(int userId, int authUserId, int roleId);

        void Create(User user, string username, string password, int userRoleId, bool sendEmail = false);

        CreateAddressResult CreateAddress(int userId, Address address);

        Document CreateDocument(int userId, string fileName, byte[] docBytes, int uploadedBy);

        int Delete(int userId);

        void DeleteAddress(int userId);

        void DeleteDocument(int userId, int docId);

        byte[] DeleteImage(int userId);

        int SetHasAccess(int userId, bool hasAccess);

        void ForgotPassword(string email);

        IEnumerable<Simplified<User>> GetSimplifiedUsers();

        User GetByAuthUserId(int authId);

        User GetByEmail(string email);

        User GetById(int userId);

        IQueryable<Document> GetUserDocuments(int userId);

        IQueryable<User> GetUsers();


        void MergePhones(int userId, PhoneCollection<UserPhone> phones);

        User Reload(int userId);

        void UpdateAddress(Address address);

        UpdateUserPicResult UpdatePic(int userId, byte[] picBytes, string fileName);

        UpdatePortalAccessResult UpdatePortalAccess(int userId, PortalAccessUpdater updater);

        byte[] UpdateUser(User user);
    }
}
