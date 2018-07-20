using System;
using System.Collections.Specialized;
using System.Configuration;

namespace Service.Utilities
{
    /// <summary>
    ///      Convenience class for retrieving app settings (and jwt settings!) from configuration.
    /// </summary>
    public static class AppSettings
    {
        public static string GetAdminSite()
        {
            return GetAppSetting("AdminSite");
        }

        public static string GetApiAddress()
        {
            return GetAppSetting("APIAddress");
        }

        public static string GetDefaultEmailFrom()
        {
            return GetAppSetting("DefaultEmailFrom");
        }

        public static string GetDocsRootDirectory()
        {
            return System.IO.Path.GetFullPath(System.AppDomain.CurrentDomain.BaseDirectory + GetAppSetting("DocsRootDir"));
        }

        public static string GetImageDirectory()
        {
            return System.IO.Path.GetFullPath(System.AppDomain.CurrentDomain.BaseDirectory + GetAppSetting("ImageDir"));
        }

        public static int GetJwtAccessMinutes()
        {
            return int.Parse(GetJwtSetting("JWTAccessMinutes"));
        }

        public static string GetJwtIssuer()
        {
            return GetJwtSetting("JWTIssuer");
        }

        public static string GetJwtKey()
        {
            return GetJwtSetting("JWTKey");
        }

        public static string GetResetEndpoint()
        {
            return GetAppSetting("ResetEndpoint");
        }

        public static string GetAdminAccessEndpoint()
        {
            return GetAppSetting("AdminAccessEndpoint");
        }

        public static string GetServiceDescription()
        {
            return GetAppSetting("ServiceDescription");
        }

        public static string GetServiceDisplayName()
        {
            return GetAppSetting("ServiceDisplayName");
        }

        public static string GetServiceName()
        {
            return GetAppSetting("ServiceName");
        }

        public static string GetTestEmail()
        {
            return GetAppSetting("TestEmail");
        }

        public static bool IsEmailTestMode()
        {
            return Convert.ToBoolean(GetAppSetting("EmailTestMode"));
        }

        private static string GetAppSetting(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }

        private static string GetJwtSetting(string key)
        {
            return ((NameValueCollection)ConfigurationManager.GetSection("jwtSettings"))[key];
        }
    }
}
