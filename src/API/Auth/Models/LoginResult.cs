using System;
using System.Collections.Generic;
using API.Jwt;

namespace API.Auth.Models
{
    /// <summary>
    ///      Result dto to return to client. Should contain any info that must be associated with the
    ///      logged in user.
    /// </summary>
    public class LoginResult
    {
        public LoginResult()
        {
        }

        public LoginResult(string jwt, JwtConfig config, int authUserId, DateTime issuedUtc, Guid refreshTokenGuid)
        {
            AuthUserId = authUserId;
            Jwt = jwt;
            IssuedUtc = issuedUtc;
            ExpiresUtc = issuedUtc.AddMinutes(config.AccessMinutes);
            RefreshTokenIdentifier = refreshTokenGuid.ToString();
        }

        public int AuthUserId { get; set; }
        public DateTime ExpiresUtc { get; set; }
        public DateTime IssuedUtc { get; set; }
        public string Jwt { get; set; }
        public string CsrfToken { get; set; }
        public string RefreshTokenIdentifier { get; set; }
        public Dictionary<int, int> ClaimFlags { get; set; }
    }
}
