using System.Web.Http;
using System.Web.Http.Description;
using API.Claims;
using Model;
using Service.Base;

namespace API.CRUD {
  public abstract class CrudVersionController<T> : CrudBaseController<T> where T : class, IVersionable, IEntity, new() 
  {
    protected CrudVersionController(ICRUDService crudservice) : base(crudservice)
    { }

    [HttpPut]
    [Route("{id:int}/version")]
    [ResponseType(typeof(byte[]))]
    [Restrict(ClaimValues.FullAccess)]
    public virtual IHttpActionResult UpdateVersion(int id, [FromBody] T data)
    {

      data = SetUpdateFields(data);

      return ExecuteConcurrentValidatedActionGen(data, Crudservice.UpdateVersionable, Crudservice.Reload<T>);

    }

    [HttpPatch]
    [Route("{id:int}/version")]
    [ResponseType(typeof(byte[]))]
    [Restrict(ClaimValues.FullAccess)]
    public virtual IHttpActionResult UpdateVersionPartial(int id, [FromBody] string data)
    {

      data = SetUpdateFields(data);

      return ExecuteValidatedAction(() => Ok(Crudservice.UpdateVersionable<T>(data)));

    }
  }
}
