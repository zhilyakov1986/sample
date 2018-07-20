using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using Service.Base;
using API.CRUD;
using Model;

namespace API.Setup.UnitTypes
{
    [RoutePrefix("api/v1/setup/unittypes")]
    [Restrict(ClaimTypes.Services, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class UnitTypesController : CrudBaseController<UnitType>
    {
        private readonly ICRUDService _service;

        public UnitTypesController(ICRUDService crudService) : base(crudService)
        {
            _service = crudService;
        }
        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        public IHttpActionResult PutUnitType(IEnumerable<UnitType> UnitTypes)
        {
            return ExecuteValidatedAction(() =>
            {
                var unitTypesArray = UnitTypes.ToArray();
                _service.CheckEntityInUse<UnitType, Good>(unitTypesArray, "UnitTypeId",
                    "Please remove all associations of Unit Types in Services before deleting.");
                _service.Update(unitTypesArray, (e, u) => e.Name = u.Name);
                return Ok();

            });

        }
    }
}
