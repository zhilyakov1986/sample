using API.Auth;
using API.ControllerBase;
using API.Jwt;
using API.RoleManager;
using Model;
using Service.Auth;
using Service.Users;
using System.Collections.Generic;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Description;
using API.Auth.Models;
using API.Claims;
using API.Common;
using API.Users.Models;
using Service.Users.Access;
using Service.Users.Models;
using ClaimTypes = API.Claims.ClaimTypes;
using User = Model.User;

namespace API.AuthUsers
{
  [RoutePrefix("api/v1/authUsers")]
  [Restrict(ClaimTypes.Users, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
  public class AuthUsersController : AuthControllerBase
  {
    private readonly IRequestDocReader _docReader;
    private readonly IUserService _userService;
    public AuthUsersController(IAuthService authService, IRoleManager roleManager, IRequestDocReader docReader, IUserService userService) : base (authService, roleManager)
    {
      _userService = userService;
      _docReader = docReader;
    }

    [HttpPut]
    [Route("{userId:int}/roles/{authUserId:int}/{roleId:int}/")]
    [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
    public IHttpActionResult AssignUserRoleToUser(int userId, int authUserId, int roleId)
    {
      return ExecuteValidatedAction(() =>
      {
        _userService.AssignRole(userId, authUserId, roleId);
        RoleManager.StampAuthUser(authUserId); // update state in role manager
        return Ok();
      });
    }

    [HttpDelete]
    [Route("{userId:int}")]
    [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
    public IHttpActionResult DeleteUser(int userId)
    {
      return ExecuteValidatedAction(() =>
      {
        if (userId == this.GetUserId())
        {
          ModelState.AddModelError("User", "Don't be a weasel! (╯°□°）╯︵ ┻━┻");
          return BadRequest(ModelState);
        }
        int authUserId = _userService.Delete(userId);
        RoleManager.DeleteUser(authUserId);
        return Ok();
      });
    }

    [HttpPut]
    [Route("{userId:int}/hasAccess/{hasAccess:bool}")]
    [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
    public IHttpActionResult SetHasAccess(int userId, bool hasAccess)
    {
      return ExecuteValidatedAction(() =>
      {
        if (this.GetUserId() == userId)
        {
          ModelState.AddModelError("User", "Don't be a weasel! (╯°□°）╯︵ ┻━┻");
          return BadRequest(ModelState);
        }

        int authUserId = _userService.SetHasAccess(userId, hasAccess);
        if (!hasAccess)
          RoleManager.DeleteUser(authUserId);
        return Ok();

      });

    }

    [HttpPut]
    [Route("updatePassword")]
    [Bypass(true)] // don't require user privileges to edit, if self only
    public IHttpActionResult UpdatePassword([FromBody] UpdatePasswordParams upp)
    {
      if (upp == null || upp.AuthUserId == 0) return BadRequest();

      // this one is tricky. make sure that the user is editing self, or that 
      // they have claims. Can't really force one or the other on the route itself since we're 
      // not passing in (or guaranteed to pass in) the userId that matches authUser, so this method
      // should be bypassed from claims attributes check and manually inspected here.
      int tokenAuthId = int.Parse(this.GetAuthUserId());
      bool ok = tokenAuthId == upp.AuthUserId; // see if editing self
      if (!ok) // not editing self: check permission / claims
      {
        var requestUser = (ClaimsPrincipal)this.GetOwinResolver().GetOwinContext().Request.User;
        ok = RestrictAttribute.CheckClaim(requestUser, ClaimTypes.Users, ClaimValues.FullAccess);
      }

      return ok ? _UpdatePassword(upp) : Unauthorized();
    }

    [HttpPut]
    [Route("{userId:int}/portalAccess")]
    [ResponseType(typeof(byte[]))]
    [Restrict(ClaimTypes.Users, ClaimValues.FullAccess)]
    public IHttpActionResult UpdatePortalAccess(int userId, PortalAccessUpdater updater)
    {
      return ExecuteConcurrentValidatedAction(userId,
          () =>
          {
            UpdatePortalAccessResult result = _userService.UpdatePortalAccess(userId, updater);
            RoleManager.StampAuthUser(result.AuthUserId);
            return Ok(result.Version);
          },
          _userService.Reload);
    }

    protected override ILoginResultDto CreateTokenResult(AuthUser authUser, AuthClient client, JwtConfig config)
    {
      User user = _userService.GetByAuthUserId(authUser.Id);
      if (user == null) return null;
      var additionalPayload = new Dictionary<string, string> { { OwinKeys.UserId, user.Id.ToString() } };
      LoginResult lr = GetBaseLoginResult(authUser, client, config, additionalPayload);
      return new UserLoginResult { LoginResult = lr, User = user };
    }
  }
}
