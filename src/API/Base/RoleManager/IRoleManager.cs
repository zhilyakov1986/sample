using System;

namespace API.RoleManager
{
    public interface IRoleManager
    {
        void StampAuthUser(int authUserId); // use on update to a user's roles, portal access, or access level

        void StampUserRole(int roleId); // use on updates to the role itself

        void CheckSetUserTime(int authUserId); // use to get time on creation of token

        void CheckSetRoleTime(int roleId); // use to get time on creation of token

        void DeleteUser(int authUserId);

        void DeleteRole(int roleId);

        bool CheckRoleTimes(int authUserId, int roleId, DateTime tokenTime); // use to validate a token against latest role state
    }
}