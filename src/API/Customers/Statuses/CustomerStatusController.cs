using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using API.CRUD;
using Model;
using Service.Base;

namespace API.Customers.Statuses
{
  [RoutePrefix("api/v1/customerstatuses")]
  [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
  public class CustomerStatusController : CrudBaseController<CustomerStatus>
  {
    public CustomerStatusController(ICRUDService crudservice) : base(crudservice)
    {    }

      public override IEnumerable<CustomerStatus> GetAll()
      {
          return Crudservice.Get<CustomerStatus>().OrderBy(cs => cs.Sort).AsEnumerable();
      }

    }
}
