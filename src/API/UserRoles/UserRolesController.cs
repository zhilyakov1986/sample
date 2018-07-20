using API.Claims;
using API.ControllerBase;
using API.CRUD;
using API.RoleManager;
using Model;
using Service.Base;
using Service.UserRoles;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.UserRoles
{
    [RoutePrefix("api/v1/userRoles")]
    [Restrict(ClaimTypes.UserRoles, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class UserRolesController : CrudBaseController<UserRole>
    {
        private readonly IRoleManager _roleManager;
        private readonly IUserRoleService _urService;
        public UserRolesController(IUserRoleService srv, IRoleManager roleManager, ICRUDService crudService) : base(crudService)
        {
            _urService = srv;
            _roleManager = roleManager;
            Searchfields = new[] { new CrudSearchFieldType("Name", CrudSearchFieldType.Method.Contains),
                new CrudSearchFieldType("Description", CrudSearchFieldType.Method.Contains) };
            // Searchchildincludes = new[] { "" };
            Getbyincludes = new[] { "UserRoleClaims" };
            Orderby = "Name";
        }

        [HttpGet]
        [Route("claimTypes")]
        public IEnumerable<ClaimType> GetClaimTypes()
        {
            // have to get funky to order the include
            return _urService
                .GetClaimTypes()
                .OrderBy(ct => ct.Name);
        }

        [HttpDelete]
        [Route("delete/{roleId:int}")]
        [Restrict(ClaimTypes.UserRoles, ClaimValues.FullAccess)]
        public IHttpActionResult DeleteRole(int roleId)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.Delete(roleId);
                _roleManager.DeleteRole(roleId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("claimValues")]
        public IEnumerable<ClaimValue> GetClaimValues()
        {
            return _urService
                .GetClaimValues()
                .OrderBy(cv => cv.Name);
        }

        [HttpGet]
        [Route("withClaims")]
        public IEnumerable<UserRole> GetWithClaims()
        {
            return _urService
                .GetRolesWithClaims()
                .OrderBy(ur => ur.Name);
        }

        [HttpPost]
        [Route("create")]
        [Restrict(ClaimTypes.UserRoles, ClaimValues.FullAccess)]
        [ResponseType(typeof(UserRole))]
        public IHttpActionResult PostUserRole(UserRole role)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.Create(role);
                _roleManager.StampUserRole(role.Id);
                return Ok(role);
            });
        }

        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.UserRoles, ClaimValues.FullAccess)]
        [ResponseType(typeof(UserRole))]
        public IHttpActionResult PutUserRole(UserRole role)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.Update(role);
                _roleManager.StampUserRole(role.Id); // update role state
                return Ok(role);
            });
        }

        [HttpPut]
        [Route("{roleId:int}/updateClaims")]
        [Restrict(ClaimTypes.UserRoles, ClaimValues.FullAccess)]
        public IHttpActionResult UpdateClaims(int roleId, [FromBody] UserRoleClaim[] urClaims)
        {
            return ExecuteValidatedAction(() =>
            {
                _urService.UpdateClaims(roleId, urClaims);
                // update role state for all changes
                foreach (var grp in urClaims.GroupBy(c => c.RoleId))
                    _roleManager.StampUserRole(grp.Key);
                return Ok();
            });
        }
    }
}
