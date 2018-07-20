using System;
using Model;

namespace Service.Auth
{
    public interface IAuthService
    {
        void AssignRole(int authUserId, int userRoleId);

        int Create(string username, string password, int userRoleId);

        Guid CreateToken(int userId, int authClientId, DateTime issuedUtc, int tokenMinutes, string jwt);

        AuthUser GenerateAuthUser(string username, bool generatePassword, string password, int userRoleId);

        AuthUser GetById(int authUserId);

        AuthUser GetByIdForLogin(int authUserId);

        AuthUser GetByUsername(string username);

        bool IsUniqueUsername(AuthUser user, string username);

        void RemoveAuthTokensByAuthUser(int authUserId);

        void RemoveToken(int userId, int authClientId, string tokenIdentitifier);

        AuthToken RetrieveToken(int userId, int authClientId, string tokenIdentitifier);

        void SendDomainEmailAccess(string email);

        void SendForgotPasswordEmail(AuthUser user, string email);

        void SendNewUserInitEmail(AuthUser user, string email);

        void SendNewUserResetEmail(AuthUser user, string email);

        void SetResetKey(AuthUser user, int resetMinutes = 15);

        AuthUser Update(AuthUser authUser);

        bool UpdatePassword(AuthUser user, string password);

        void ValidateAndThrow(AuthUser user);

        AuthClient ValidateAuthClient(int authClientId, string authClientSecret);

        AuthUser ValidateDomainEmailLogin(string resetKey);

        AuthUser ValidateLogin(string username, string password);

        AuthUser ValidateLogin(int userId, string password);

        AuthUser ValidateReset(int userId, string resetKey);

        void MarkResetInvalid(int authUserId);
    }
}
