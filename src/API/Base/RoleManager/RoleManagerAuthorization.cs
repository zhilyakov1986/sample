using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using API.Jwt;
using Microsoft.Owin;
using Service.Utilities;

namespace API.RoleManager
{
    using AppFunc = Func<IDictionary<string, object>, Task>;

    public class RoleManagerAuthorization
    {
        private readonly AppFunc _next;
        private readonly IRoleManager _roleManager;

        public RoleManagerAuthorization(AppFunc next, IRoleManager roleManager)
        {
            _next = next;
            _roleManager = roleManager;
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            // get owin context from environment
            IOwinContext context = new OwinContext(environment);

            // check for token.
            var user = context.Authentication.User;
            if (user != null)
            {
                // if there was a token and user is set, make sure claims are up to date
                var issuedUtc = new DateTime(long.Parse(user.FindFirst(OwinKeys.Ticks).Value));
                var id = int.Parse(user.FindFirst(OwinKeys.AuthUserId).Value);
                var role = int.Parse(user.FindFirst(OwinKeys.UserRoleId).Value);
                if (!_roleManager.CheckRoleTimes(id, role, issuedUtc))
                {
                    if (role > 0)
                    {
                        // reject - add inidcation header
                        context.Response.Headers.Add("Access-Control-Expose-Headers", new[] { "X-Update-Roles" });
                        context.Response.Headers.Add("X-Update-Roles", new[] { "true" });    
                    }   
                    // manually add cors header for this response
                    context.Response.Headers.Add("Access-Control-Allow-Origin", new[] { AppSettings.GetAdminSite() });
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
            }
                await _next.Invoke(environment);
        }
    }
}
