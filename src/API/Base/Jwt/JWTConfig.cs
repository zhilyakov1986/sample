using Service.Utilities;

namespace API.Jwt
{
    public class JwtConfig
    {
        public JwtConfig()
        {
        }

        public JwtConfig(bool useAppSettings, string appliesToAddress)
        {
            if (useAppSettings)
            {
                SecretKey = AppSettings.GetJwtKey();
                Issuer = AppSettings.GetJwtIssuer();
                AccessMinutes = AppSettings.GetJwtAccessMinutes();
            }

            AppliesToAddress = appliesToAddress;
        }

        public int AccessMinutes { get; set; }
        public string AppliesToAddress { get; set; }
        public string Issuer { get; set; }
        public int RefreshMinutes { get; set; }
        public string SecretKey { get; set; }
    }
}