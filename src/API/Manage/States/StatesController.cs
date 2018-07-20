using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using Service.Base;
using API.CRUD;
using Model;

namespace API.Manage.States
{
    [RoutePrefix("api/v1/manage/states")]
    [Restrict(ClaimTypes.Services, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class StatesController : CrudBaseController<State>
    {
        private readonly ICRUDService _service;

        public StatesController(ICRUDService crudService) : base(crudService)
        {
            _service = crudService;
        }
        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        public IHttpActionResult PutState(IEnumerable<State> UnitTypes)
        {
            return ExecuteValidatedAction(() =>
            {
                var unitTypesArray = UnitTypes.ToArray();
                //_service.CheckEntityInUse<SetupUnitType, ManageListItem>(unitTypesArray, "SetupUnitTypeId",
                //    "Please remove all associations before deleting.");
                _service.Update(unitTypesArray, (e, u) => e.Name = u.Name);
                _service.Update(unitTypesArray, (e, u) => e.TaxRate = u.TaxRate);
                return Ok();

            });
        }
    }
}
