using API.Claims;
using Service.Base;
using API.CRUD;
using Model;
using System.Web.Http;
using System.Collections.Generic;
using System.Linq;

namespace API.Goods
{
    [RoutePrefix("api/v1/servicetypes")]
    [Restrict(ClaimTypes.Services, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ServiceTypesController : CrudBaseController<ServiceType>
    {
        private readonly ICRUDService _service;
        public ServiceTypesController(ICRUDService crudService) : base(crudService)
        {
            _service = crudService;
        }
    }
}
