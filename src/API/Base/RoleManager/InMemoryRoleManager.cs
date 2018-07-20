using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace API.RoleManager
{
    /// <summary>
    ///     Role Manager.
    ///     Used to validate the current state of a Jwt against
    ///     potential role changes to an AuthUser or the UserRole itself.
    ///     MUST be registered as a Singleton.
    /// </summary>
    public class InMemoryRoleManager : IRoleManager
    {
        private readonly ConcurrentDictionary<int, DateTime> _authUserTimes;
        private readonly ConcurrentDictionary<int, DateTime> _userRoleTimes;

        public InMemoryRoleManager()
        {
            _authUserTimes = new ConcurrentDictionary<int, DateTime>();
            _userRoleTimes = new ConcurrentDictionary<int, DateTime>();
        }

        public void StampAuthUser(int authUserId)
        {
            _authUserTimes[authUserId] = DateTime.UtcNow;
        }

        public void CheckSetUserTime(int authUserId)
        {
            CheckSetTime(authUserId, _authUserTimes);
        }

        public void StampUserRole(int roleId)
        {
            _userRoleTimes[roleId] = DateTime.UtcNow;
        }

        public void CheckSetRoleTime(int roleId)
        {
            CheckSetTime(roleId, _userRoleTimes);
        }

        public void DeleteUser(int authUserId)
        {
            DateTime o;
            _authUserTimes.TryRemove(authUserId, out o);
        }

        public void DeleteRole(int roleId)
        {
            DateTime o;
            _userRoleTimes.TryRemove(roleId, out o);
        }

        public bool CheckRoleTimes(int authUserId, int roleId, DateTime tokenTime)
        {
            DateTime dtUser;
            DateTime dtRole;

            return _authUserTimes.TryGetValue(authUserId, out dtUser)
                   && tokenTime >= dtUser
                   && _userRoleTimes.TryGetValue(roleId, out dtRole)
                   && tokenTime >= dtRole;
        }

        private static void CheckSetTime(int id, IDictionary<int, DateTime> d)
        {
            if (!d.ContainsKey(id))
                d[id] = DateTime.UtcNow;
        }
    }
}