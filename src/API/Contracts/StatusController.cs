using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using Service.Base;
using API.CRUD;
using Model;

namespace API.Contracts
{
    [RoutePrefix("api/v1/setup/statuses")]
    [Restrict(ClaimTypes.Services, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ContractStatusController : CrudBaseController<ContractStatus>
    {
        private readonly ICRUDService _service;

        public ContractStatusController(ICRUDService crudService) : base(crudService)
        {
            _service = crudService;
        }
       
    }
}
