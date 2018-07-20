namespace API.Jwt
{
    /// <summary>
    ///     These are helper keys that can be used when adding properties to the Jwt payload,
    ///     and later pulling into the Owin context.
    /// </summary>
    public static class OwinKeys
    {
        public static readonly string AuthUserId = "mt_AuthUserId";
        public static readonly string AuthUsername = "mt_AuthUsername";
        public static readonly string AuthClientId = "mt_AuthClientId";
        public static readonly string UserId = "mt_UserId";
        public static readonly string UserRoleId = "mt_UserRoleId";
        public static readonly string Ticks = "mt_Ticks";
        public static readonly string AccessLevelId = "mt_AccessLevelId";
    }
}