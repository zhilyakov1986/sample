using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Controllers;
using API.Base.Claims;
using API.Jwt;

namespace API.Claims
{
    /// <summary>
    ///     Retricts a controller or method based on ClaimType and OR-ed ClaimValue bit flags.
    ///     See the enum ClaimValue for possible values.
    ///     Will return 401 Unauthorized if user does not have proper claim in token.
    ///     Can be bypassed with the Bypass attribute.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class RestrictAttribute : AuthorizeAttribute
    {
        private readonly ClaimTypes _claimType;
        private readonly ClaimValues _claimValues;
    private ClaimValues fullAccess;

    public RestrictAttribute(ClaimTypes ct, ClaimValues cv)
        {
            _claimType = ct;
            _claimValues = cv;
        }

    public RestrictAttribute(ClaimValues fullAccess)
    {
      this.fullAccess = fullAccess;
    }

    protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            if (!base.IsAuthorized(actionContext))
                return false;

            // get claims of user (through token)
            var user = (ClaimsPrincipal)actionContext.ControllerContext.RequestContext.Principal;

            // check filter override
            if (AllowAsFilter(actionContext, user))
                return true;

            // check edit self override
            if (IsEditingSelf(actionContext, user))
                return true;

            // check claims
            return _claimValues == 0 || CheckClaim(user, _claimType, _claimValues);
        }

        private static bool AllowAsFilter(HttpActionContext actionContext, ClaimsPrincipal user)
        {
            var bypassAttrs = actionContext.ActionDescriptor.GetCustomAttributes<BypassAttribute>();
            return bypassAttrs.Any(b => b.Any || CheckClaim(user, b.ClaimType, b.ClaimValues));
        }

        private static bool IsEditingSelf(HttpActionContext actionContext, ClaimsPrincipal user)
        {
            var allowSelfEditAttrs = actionContext.ActionDescriptor.GetCustomAttributes<AllowSelfEditAttribute>();
            bool ok = allowSelfEditAttrs.Any();
            Claim claim = null;
            int requestUserId = 0;
            int tokenUserId = 0;

            if (ok)
            {
                claim = user.FindFirst(OwinKeys.UserId);
                ok = claim != null;
            }

            if (ok)
            {
                tokenUserId = int.Parse(claim.Value);
                var userIdObj = actionContext.RequestContext.RouteData.Values
                    .Where(kvp => kvp.Key.ToLower() == "id")
                    .Select(kvp => kvp.Value)
                    .FirstOrDefault();
                ok = (userIdObj != null) && int.TryParse(userIdObj as string, out requestUserId);       
            }

            ok = ok && requestUserId == tokenUserId && tokenUserId > 0;
            
            return ok;

        }

        public static bool CheckClaim(ClaimsPrincipal user, ClaimTypes ct, ClaimValues cv)
        {
            Claim claim = user.FindFirst(ClaimsHelper.SetTypePrefix((int) ct));
            if (claim == null) return false;
            ClaimValues claimed = (ClaimValues) int.Parse(claim.Value);
            return (claimed & cv) != 0; // make sure one of OR-ed flags is present
        }
    }
}
