using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using Service.Base;
using API.CRUD;
using Model;

namespace API.Setup.ServiceDivisions
{
    [RoutePrefix("api/v1/setup/servicedivisions")]
    [Restrict(ClaimTypes.Services, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ServiceDivisionsController : CrudBaseController<ServiceDivision>
    {
        private readonly ICRUDService _service;

        public ServiceDivisionsController(ICRUDService crudService) : base(crudService)
        {
            _service = crudService;
        }
        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        public IHttpActionResult PutServiceDivision(IEnumerable<ServiceDivision> ServiceDivisions)
        {
            return ExecuteValidatedAction(() =>
            {
                var serviceDivisionsArray = ServiceDivisions.ToArray();
                _service.CheckEntityInUse<ServiceDivision, Good>(serviceDivisionsArray, "ServiceDivisionId",
                    "Please remove all associations of Divisions in Services before deleting.");
                _service.CheckEntityInUse<ServiceDivision, Contract>(serviceDivisionsArray, "ServiceDivisionId",
                    "Please remove all associations of Divisions in Contracts before deleting.");
                _service.Update(serviceDivisionsArray, (e, u) => e.Name = u.Name);
                return Ok();

            });

        }
    }
}
