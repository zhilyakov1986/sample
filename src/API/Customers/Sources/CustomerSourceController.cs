using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using API.CRUD;
using Model;
using Service.Base;

namespace API.Customers.Sources
{
  [RoutePrefix("api/v1/customersources")]
  [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
  public class CustomerSourceController : CrudBaseController<CustomerSource>
  {
        private readonly ICRUDService _service;

        public CustomerSourceController(ICRUDService crudservice) : base(crudservice) {
            _service = crudservice;
        }

        [HttpPut]
        [Route("update")]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        public IHttpActionResult PutSources(IEnumerable<CustomerSource> sources) {
            return ExecuteValidatedAction(() =>
            {
                var sourcesArray = sources.ToArray();
                _service.CheckEntityInUse<CustomerSource, Customer>(sourcesArray, "SourceId",
                    "Customer source is already in use.  Please remove all associations before deleting.");
                   
                _service.Update(sourcesArray, (e,u) =>
                {
                    e.Name = u.Name;
                    e.Sort = u.Sort;
                });
                return Ok();
            });
        }

      public override IEnumerable<CustomerSource> GetAll()
      {
          return Crudservice.Get<CustomerSource>().OrderBy(cs => cs.Sort).AsEnumerable();
      }

    }
}
