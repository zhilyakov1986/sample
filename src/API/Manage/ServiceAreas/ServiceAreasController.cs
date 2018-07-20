using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using Service.Base;
using API.CRUD;
using Model;

namespace API.Setup.ServiceAreas
{
    [RoutePrefix("api/v1/setup/serviceareas")]
    [Restrict(ClaimTypes.Services, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ServiceAreasController : CrudBaseController<ServiceArea>
    {
        private readonly ICRUDService _service;

        public ServiceAreasController(ICRUDService crudService) : base(crudService)
        {
            _service = crudService;
        }
        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        public IHttpActionResult PutServiceAreas(IEnumerable<ServiceArea> ServiceAreas)
        {
            return ExecuteValidatedAction(() =>
            {
                var serviceAreasArray = ServiceAreas.ToArray();
                _service.CheckEntityInUse<ServiceArea, CustomerLocation>(serviceAreasArray, "ServiceAreaId",
                    "Please remove all associations of Service Areas in Customer Locations before deleting.");
                // TO DO AZ Ask Chris if I shold check asociations with many-to-many table
                _service.CheckEntityInUse<ServiceArea, Contact>(serviceAreasArray, "ServiceAreaId",
                    "Please remove all associations f Service Areas in Contracts before deleting.");
                _service.Update(serviceAreasArray, (e, u) => e.Name = u.Name);
                return Ok();

            });

        }
    }
}
