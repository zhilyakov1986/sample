using API.Claims;
using API.ControllerBase;
using API.Jwt;
using API.RoleManager;
using Model;
using Service.Auth;
using Service.Auth.Validation;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using API.Auth.Models;
using API.Auth.Validators;
using API.Csrf;
using AuthClient = Model.AuthClient;
using AuthUser = Model.AuthUser;

namespace API.Auth
{
    public abstract class AuthControllerBase : ApiControllerBase
    {
        protected IAuthService AuthService;
        protected IRoleManager RoleManager;

        private static readonly HashSet<string> LoginDomains = new HashSet<string>
            {"milestechnologies.com", "4miles.com"};

        protected AuthControllerBase(IAuthService authService, IRoleManager roleManager)
        {
            AuthService = authService;
            RoleManager = roleManager;
        }

        private string RequestLeftPart => Request.RequestUri.GetLeftPart(UriPartial.Authority);

        /// <summary>
        ///     Authenticates from a reset link
        ///     sent to a valid domain email.
        /// </summary>
        /// <param name="depp"></param>
        /// <returns>Returns an IHttpActionResult of an ILoginResultDto with payload.</returns>
        [HttpPost]
        [Route("adminAccess")]
        [AllowAnonymous]
        [ResponseType(typeof(ILoginResultDto))]
        public virtual IHttpActionResult GrantAdminDomainEmailAccess([FromBody] DomainEmailPasswordParams depp)
        {
            return ExecuteValidatedAction(() =>
            {
                ValidatorHelpers.ValidateAndThrow(depp, new DomainEmailPasswordParamsValidator());

                AuthClient client = ValidateClient(depp);
                if (client == null) return ImATeapot();

                AuthUser au = AuthService.ValidateDomainEmailLogin(depp.ResetKey);
                if (au == null) return ImATeapot();

                CheckSetRoleManager(au);
                ILoginResultDto result = CreateTokenResult(au, client); // return token
                return result != null ? (IHttpActionResult)Ok(result) : ImATeapot();
            });
        }

        /// <summary>
        ///      Endpoint for using refresh token to generate new access token.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("refresh")]
        [AllowAnonymous]
        [ResponseType(typeof(ILoginResultDto))]
        public virtual IHttpActionResult RequestRefresh([FromBody] RefreshParams rp)
        {
            return ExecuteValidatedAction(() =>
            {
                // manually validating, as api is no longer wired up...
                ValidatorHelpers.ValidateAndThrow(rp, new RefreshParamsValidator());

                // validate AuthClient and RefreshToken
                JwtConfig config = new JwtConfig(true, RequestLeftPart);
                AuthClient client = ValidateClient(rp);
                AuthToken rt = AuthService.RetrieveToken(rp.AuthUserId, rp.AuthClientId, rp.TokenIdentifier);

                AddNoCacheHeader();

                if (client == null || rt == null || rt.AuthClientId != client.Id ||
                    !JsonWebToken.GrantNewAccess(config, rt.Token))
                    return ImATeapot();

                // get user
                AuthUser user = AuthService.GetByIdForLogin(rt.AuthUserId);
                if (user == null)
                    return ImATeapot();

                CheckSetRoleManager(user); // make sure state is set in RoleManager
                ILoginResultDto loginResult = CreateTokenResult(user, client, config); // create new tokens, return result
                return loginResult != null ? (IHttpActionResult)Ok(loginResult) : ImATeapot();
            });
        }

        /// <summary>
        ///      Verify user once. Create and return a Jwt.
        /// </summary>
        /// <param name="lp"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("token")]
        [AllowAnonymous]
        [ResponseType(typeof(ILoginResultDto))]
        public virtual IHttpActionResult RequestToken([FromBody] LoginParams lp)
        {
            return ExecuteValidatedAction(() =>
            {
                ValidatorHelpers.ValidateAndThrow(lp, new LoginParamsValidator());
                var client = ValidateClient(lp);
                if (client == null) return ImATeapot();
                
                bool isDomainEmail = IsLoginDomainEmail(lp.Username);
                if (!isDomainEmail && lp.Password == null) return ImATeapot();

                AddNoCacheHeader();

                // check valid login
                var authUser = AuthService.ValidateLogin(lp.Username, lp.Password);
                if (authUser != null)
                {
                    CheckSetRoleManager(authUser); // make sure state is set in RoleManager
                    ILoginResultDto loginResult = CreateTokenResult(authUser, client); // issue the token
                    return loginResult != null ? (IHttpActionResult)Ok(loginResult) : ImATeapot();
                }

                // check valid email domain
                if (!isDomainEmail) return ImATeapot();
                AuthService.SendDomainEmailAccess(lp.Username);
                return Ok(new DomainEmailLoginResult { Email = lp.Username, SentEmail = true });
            });
        }

        /// <summary>
        ///      Endpoint for resetting password after forgetting.
        /// </summary>
        /// <param name="rpp"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("reset")]
        [AllowAnonymous]
        [ResponseType(typeof(ILoginResultDto))]
        public virtual IHttpActionResult ResetPassword([FromBody] ResetPasswordParams rpp)
        {
            return ExecuteValidatedAction(() =>
            {
                ValidatorHelpers.ValidateAndThrow(rpp, new ResetPasswordParamsValidator());

                // validate client
                AuthClient client = ValidateClient(rpp);
                if (client == null) return ImATeapot();

                // validate user
                AuthUser user = AuthService.ValidateReset(rpp.AuthUserId, rpp.ResetKey);
                if (user == null) return BadRequest();

                // change password
                AuthService.UpdatePassword(user, rpp.Password);
                CheckSetRoleManager(user); // make sure state is set in RoleManager
                ILoginResultDto result = CreateTokenResult(user, client); // return token
                AuthService.MarkResetInvalid(rpp.AuthUserId);
                return result != null ? (IHttpActionResult)Ok(result) : ImATeapot();
            });
        }

        /// <summary>
        ///     Updates a user's password.
        ///     Call this from inherited controller so that you can
        ///     apply custom attributes / routes with custom protection.
        /// </summary>
        protected IHttpActionResult _UpdatePassword([FromBody] UpdatePasswordParams upp)
        {

            return ExecuteValidatedAction(() =>
            {
                ValidatorHelpers.ValidateAndThrow(upp, new UpdatePasswordValidator());
                var user = AuthService.ValidateLogin(upp.AuthUserId, upp.OldPassword);
                if (user == null)
                    return ImATeapot();

                AuthService.UpdatePassword(user, upp.Password);
                RoleManager.StampAuthUser(upp.AuthUserId); // require other tokens to refresh
                return Ok();
            });
        }

        /// <summary>
        ///      Updates a user's username.
        /// </summary>
        /// <param name="upp"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("UpdateUsername")]
        public virtual IHttpActionResult UpdateUsername(UpdateUsernameParams upp)
        {
            return ExecuteValidatedAction(() =>
            {
                ValidatorHelpers.ValidateAndThrow(upp, new UpdateUsernameValidator());

                var user = AuthService.GetById(upp.AuthUserId);
                if (user == null)
                    return ImATeapot();

                user.Username = upp.Username;
                AuthService.Update(user);
                return Ok();
            });
        }

        /// <summary>
        ///      This method can be overridden to return specific info about whatever entity is being
        ///      used for authentication, so long as the return type implements the ILoginResultDto interface.
        /// </summary>
        /// <param name="authUser"></param>
        /// <param name="client"></param>
        /// <param name="config"></param>
        /// <returns></returns>
        protected virtual ILoginResultDto CreateTokenResult(AuthUser authUser, AuthClient client, JwtConfig config)
        {
            LoginResult lr = GetBaseLoginResult(authUser, client, config);
            return new DefaultLoginResult { LoginResult = lr };
        }

        protected ILoginResultDto CreateTokenResult(AuthUser user, AuthClient client)
        {
            JwtConfig config = new JwtConfig(true, RequestLeftPart);
            return CreateTokenResult(user, client, config);
        }

        /// <summary>
        ///     Creates a basic login result.
        ///     Adds user role claims to Jwt payload
        ///     NOTE: If you duplicate a key in the additionalPayload, this will error.
        /// </summary>
        /// <param name="authUser"></param>
        /// <param name="client"></param>
        /// <param name="config"></param>
        /// <param name="additionalPayload"></param>
        /// <returns></returns>
        protected LoginResult GetBaseLoginResult(AuthUser authUser, AuthClient client, JwtConfig config, IDictionary<string, string> additionalPayload = null)
        {
            config.RefreshMinutes = client.RefreshTokenMinutes; // MUST set refresh minutes by client
            var now = DateTime.UtcNow;
            IDictionary<string, string[]> payload = CreateJwtPayload(authUser, client);
            if (additionalPayload != null)
            {
                foreach (var kv in additionalPayload)
                {
                    payload.Add(kv.Key, new[] { kv.Value });
                }
            }
            // add ossied time for easier parsing
            payload.Add(OwinKeys.Ticks, new[] { now.Ticks.ToString() });

            // add claims
            bool hasClaims = (authUser.UserRole?.UserRoleClaims != null);
            var claimFlags = new Dictionary<int, int>();
            if (hasClaims)
            {
                foreach (var cgroup in authUser.UserRole.UserRoleClaims.GroupBy(cv => cv.ClaimTypeId))
                {
                    int claimValues = cgroup.Aggregate(0, (v, urc) => v | urc.ClaimValueId); // | them together
                    claimFlags.Add(cgroup.Key, claimValues);
                    payload[ClaimsHelper.SetTypePrefix(cgroup.Key)] = new [] {claimValues.ToString()};
                }
            }

            string accessToken = JsonWebToken.CreateAccessToken(config, now, payload);
            string refreshToken = JsonWebToken.CreateRefreshToken(config, now, payload);
            string csrfToken = CsrfToken.Create(accessToken);
            Guid refreshGuid = AuthService.CreateToken(authUser.Id, client.Id, now, config.RefreshMinutes, refreshToken);
            return new LoginResult
            {
                AuthUserId = authUser.Id,
                ClaimFlags = claimFlags,
                IssuedUtc = now,
                ExpiresUtc = now.AddMinutes(config.AccessMinutes),
                RefreshTokenIdentifier = refreshGuid.ToString(),
                Jwt = accessToken,
                CsrfToken = csrfToken
            };
        }

        private void CheckSetRoleManager(AuthUser user)
        {
            RoleManager.CheckSetUserTime(user.Id);
            RoleManager.CheckSetRoleTime(user.RoleId);
        }

        private static IDictionary<string, string[]> CreateJwtPayload(AuthUser user, AuthClient client)
        {
            var payload = new Dictionary<string, string[]>
            {
                [OwinKeys.AuthUserId] = new[] {user.Id.ToString()},
                [OwinKeys.AuthUsername] = new[] {user.Username},
                [OwinKeys.AuthClientId] = new[] {client.Id.ToString()},
                [OwinKeys.UserRoleId] = new[] {user.RoleId.ToString()}
            };

            return payload;
        }

        private static bool IsLoginDomainEmail(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return false;
            string[] emailAndDomain = username.Split('@');
            return emailAndDomain.Length == 2 &&
                   LoginDomains.Contains(emailAndDomain[1]);
        }
        private AuthClient ValidateClient(IAuthClientParams ac)
        {
            return AuthService.ValidateAuthClient(ac.AuthClientId, ac.AuthClientSecret);
        }
    }
}
