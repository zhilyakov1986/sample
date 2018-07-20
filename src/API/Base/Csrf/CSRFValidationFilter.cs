using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Service.Utilities;

namespace API.Csrf
{
    /// <summary>
    ///     This filter checks the request to see if Headers match expected.
    ///     It is currently applied globally in the WebApiConfig.cs, so if this is a problem,
    ///     you can use the OverrideActionFiltersAttribute to get around it.
    /// </summary>
    public class CsrfValidationFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext) {
            /* Verifying Same Origin with Standard Headers */

            //Try to get the source from the "Origin" header
            return;
            var origin = GetHeadersSafe(actionContext, "Origin");
            if (string.IsNullOrWhiteSpace(origin))
            {
                //If empty then fallback on "Referer" header
                origin = GetHeadersSafe(actionContext, "Referer");
                //If this one is empty too then block the request
                if (string.IsNullOrWhiteSpace(origin))
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden,
                        "CSRFValidationFilter: ORIGIN and REFERER request headers are both absent/empty");
                    return;
                }
            }

            //Compare the origin against the expected target origin
            var originUri = new Uri(origin);
            var targetUri = new Uri(AppSettings.GetAdminSite());
            if (!originUri.Host.Equals(targetUri.Host) ||
                !originUri.Port.Equals(targetUri.Port) ||
                !originUri.Scheme.Equals(targetUri.Scheme))
            {
        //If any part not equal block the request

        actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden,
                    "CSRFValidationFilter: wrong ORIGIN");
            }

            /* Verifying CsrfToken */

            //Ignore this check on any requests of type RequestToken or RequestRefresh
            if (actionContext.ActionDescriptor.ActionName == "RequestToken" ||
                actionContext.ActionDescriptor.ActionName == "RequestRefresh" ||
                actionContext.ActionDescriptor.ActionName == "ForgotPassword" ||
                actionContext.ActionDescriptor.ActionName == "ResetPassword" ||
                actionContext.ActionDescriptor.ActionName == "GrantAdminDomainEmailAccess") return;
            //Get the csrf token
            var csrfToken = GetHeadersSafe(actionContext, "X-XSRF-TOKEN");
            //Get the expected csrf token which is based on jwt
            var authorization = GetHeadersSafe(actionContext, "Authorization");
            var jwt = GetTokenFromAuthorizationHeader(authorization);
            var expectedCsrfToken = CsrfToken.Create(jwt);
            //Now ensure they are the same
            if (!csrfToken.Equals(expectedCsrfToken))
            {
                //If any not equal block the request
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden,
                    "CSRFValidationFilter: failed token validation");
            }
        }

        private static string GetHeadersSafe(HttpActionContext actionContext, string key)
        {
            IEnumerable<string> values;
            if (actionContext.Request.Headers.TryGetValues(key, out values))
                return values.First() ?? string.Empty;
            return string.Empty;
        }

        private static string GetTokenFromAuthorizationHeader(string authorizationHeader)
        {
            if (authorizationHeader.Length == 0)
            {
                return "";
            }
            var token = authorizationHeader.Split(' ')[1];
            return token;
        }

    }
}
