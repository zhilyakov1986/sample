using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin;
using log4net;
using System.Reflection;

namespace API.Jwt
{
  using AppFunc = Func<IDictionary<string, object>, Task>;

  public class JwtAuthenticaton
  {
    private readonly AppFunc _next;
    private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

    public JwtAuthenticaton(AppFunc next)
    {
      _next = next;
    }

    /// <summary>
    ///      Adds any custom claims from the JWT object into our OWIN Context. This will provide
    ///      access to the signed in user's properties in our controllers.
    /// </summary>
    /// <param name="claimsPrincipal"></param>
    /// <param name="context">        </param>
    public void AddClaimsToContext(ClaimsPrincipal claimsPrincipal, ref IOwinContext context)
    {
      foreach (var c in claimsPrincipal.Claims.Where(cc => cc.Type.StartsWith("mt_")))
      {
        context.Set(c.Type, c.Value);
      }
    }

    /// <summary>
    ///      Parses Authorization header for JWT.
    /// </summary>
    /// <param name="authorizationHeader"></param>
    /// <returns></returns>
    public string GetTokenFromAuthorizationHeader(string[] authorizationHeader)
    {
      if (authorizationHeader.Length == 0)
      {
        return "";
      }
      var token = authorizationHeader[0].Split(' ')[1];
      return token;
    }

    public async Task Invoke(IDictionary<string, object> environment)
    {
      // get owin context from environment
      IOwinContext context = new OwinContext(environment);

      // check headers
      var headers = context.Request.Headers as IDictionary<string, string[]>;
      if (headers == null)
        throw new ApplicationException(
            "Invalid OWIN request. Expected owin.RequestHeaders to be an IDictionary<string, string[]>.");

      ProcessToken(headers, ref context);

      await _next.Invoke(environment);
    }

    /// <summary>
    ///      Gets token, verifies, and adds claims to OWIN context.
    /// </summary>
    /// <param name="headers"></param>
    /// <param name="context"></param>
    public void ProcessToken(IDictionary<string, string[]> headers, ref IOwinContext context)
    {
      try
      {
        // verify token and set principal
        if (!headers.ContainsKey("Authorization")) return;
        var token = GetTokenFromAuthorizationHeader(headers["Authorization"]);
        if (token == "") return;
        var jwtConfig = new JwtConfig(true, context.Request.Uri.GetLeftPart(UriPartial.Authority));
        var claimsPrincipal = JsonWebToken.VerifyToken(jwtConfig, token);
        AddClaimsToContext(claimsPrincipal, ref context);
        // set the context user to trigger Auth Attribute
        context.Request.User = claimsPrincipal;
      }
      catch (Exception e)
      {
        // ignored
        Logger.Error("Failed Token", e);

      }
    }
  }
}
