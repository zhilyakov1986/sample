using System;
using System.Collections.Generic;
using System.IdentityModel.Protocols.WSTrust;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace API.Jwt
{
    /// <summary>
    ///     Handles creation and verification of Json Web Tokens.
    /// </summary>
    public static class JsonWebToken
    {
        /// <summary>
        ///     Creates an access token from info.
        ///     Basically, just uses the accessMinutes from the JWTConfig.
        ///     See JWTConfig for more info.
        /// </summary>
        /// <param name="config"></param>
        /// <param name="start"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static string CreateAccessToken(JwtConfig config, DateTime start, IDictionary<string, string[]> payload)
        {
            return CreateToken(config, start, payload, false);
        }

        /// <summary>
        ///     Creates a refresh token.
        ///     Uses the refreshMinutes from the JWTConfig.
        ///     See JWTConfig for more info.
        /// </summary>
        /// <param name="config"></param>
        /// <param name="start"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static string CreateRefreshToken(JwtConfig config, DateTime start, IDictionary<string, string[]> payload)
        {
            return CreateToken(config, start, payload, true);
        }

        /// <summary>
        ///     Creates a token
        /// </summary>
        /// <param name="config"></param>
        /// <param name="start"></param>
        /// <param name="payload"></param>
        /// <param name="isRefresh"></param>
        /// <returns></returns>
        private static string CreateToken(JwtConfig config, DateTime start, IDictionary<string, string[]> payload,
            bool isRefresh)
        {
            var claimsIdentity = CreateClaimsIdentity(payload);
            var descriptor = CreateDescriptor(start, config, claimsIdentity, isRefresh);
            return CreateToken(descriptor);
        }

        /// <summary>
        ///     Creates claims from dictionary of string key-value pairs.
        ///     A little funky since a dictionary can only have one key / value, 
        ///     but claims can have multiple.
        /// </summary>
        /// <param name="payload"></param>
        /// <returns></returns>
        private static ClaimsIdentity CreateClaimsIdentity(IDictionary<string, string[]> payload)
        {
            var claimsIdentity = new ClaimsIdentity();
            foreach (var pair in payload)
                foreach (var val in pair.Value)
                    claimsIdentity.AddClaim(new Claim(pair.Key, val));    
            return claimsIdentity;
        }

        /// <summary>
        ///     Encodes string a UTF8 bytes.
        /// </summary>
        /// <param name="secretKey"></param>
        /// <returns></returns>
        private static byte[] GetSymKey(string secretKey)
        {
            return Encoding.UTF8.GetBytes(secretKey);
        }

        /// <summary>
        ///     Creates the Security Token Descriptor from the config
        ///     settings and Claims Identity.
        /// </summary>
        /// <param name="date"></param>
        /// <param name="config"></param>
        /// <param name="ci"></param>
        /// <param name="isRefresh"></param>
        /// <returns></returns>
        private static SecurityTokenDescriptor CreateDescriptor(DateTime date, JwtConfig config, ClaimsIdentity ci,
            bool isRefresh)
        {
            var symKey = GetSymKey(config.SecretKey);
            var minutes = isRefresh ? config.RefreshMinutes : config.AccessMinutes;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = ci,
                TokenIssuerName = config.Issuer,
                AppliesToAddress = config.AppliesToAddress,
                Lifetime = new Lifetime(date, date.AddMinutes(minutes)),
                SigningCredentials = new SigningCredentials(new InMemorySymmetricSecurityKey(symKey),
                    "http://www.w3.org/2001/04/xmldsig-more#hmac-sha256",
                    "http://www.w3.org/2001/04/xmlenc#sha256")
            };
            return tokenDescriptor;
        }

        /// <summary>
        ///     Creates the actual token from the descriptor.
        /// </summary>
        /// <param name="descriptor"></param>
        /// <returns></returns>
        public static string CreateToken(SecurityTokenDescriptor descriptor)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(descriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        ///     Verifies token and returns claims.
        ///     Throws exception if invalid or unverified.
        /// </summary>
        /// <param name="config"></param>
        /// <param name="tokenStr"></param>
        /// <returns></returns>
        public static ClaimsPrincipal VerifyToken(JwtConfig config, string tokenStr)
        {
            var validationParams = GetValidationParams(config);
            SecurityToken jwt;
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(tokenStr, validationParams, out jwt);
            return principal;
        }

        /// <summary>
        ///     Creates validation parameters from config settings.
        /// </summary>
        /// <param name="config"></param>
        /// <returns></returns>
        private static TokenValidationParameters GetValidationParams(JwtConfig config)
        {
            return new TokenValidationParameters
            {
                ValidAudience = config.AppliesToAddress,
                ValidateAudience = true,
                IssuerSigningKey = new InMemorySymmetricSecurityKey(GetSymKey(config.SecretKey)),
                ValidateIssuerSigningKey = true,
                ValidIssuer = config.Issuer,
                ValidateIssuer = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(1.5)
            };
        }

        /// <summary>
        ///     This verifies a refresh token.
        ///     If valid, we return a new access token
        ///     and a new refresh token with the necessary info to save it.
        /// </summary>
        /// <param name="config"></param>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        public static bool GrantNewAccess(JwtConfig config, string refreshToken)
        {
            try
            {
                // remember, this will throw if invalid / expired
                VerifyToken(config, refreshToken);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}