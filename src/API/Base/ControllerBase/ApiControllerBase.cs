using FluentValidation;
using Model;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Service.Utilities;
using log4net;
using System.Reflection;
using API.Common;

namespace API.ControllerBase
{
  public abstract class ApiControllerBase : ApiController
  {
    private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

    public IHttpActionResult ImATeapot()
    {
      return new Teapot();
    }

    public IHttpActionResult SendBadRequest()
    {
      
      Logger.Error("Bad Request\n" + Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase));
      return BadRequest();
    }

    public IHttpActionResult SendBadRequest(ModelStateDictionary modelState)
    {
      Logger.Error("Bad Request\n" + Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase) + '\n' + Newtonsoft.Json.JsonConvert.SerializeObject(modelState, Newtonsoft.Json.Formatting.Indented));
      return BadRequest(modelState);
    }

    protected static bool IsBlankQuery(string query)
    {
      return string.IsNullOrWhiteSpace(query) || query == "*";
    }

    protected void AddHeaders(string key, string val)
    {
      AddHeaders(key, new[] { val });
    }

    protected void AddHeaders(string key, string[] val)
    {
      var ctx = this.GetOwinResolver().GetOwinContext();
      ctx.Response.Headers.Add(key, val);
    }

    protected void AddTotalCountHeader(string count)
    {
      AddHeaders("X-List-Count", count);
    }

        protected void AddNoCacheHeader()
        {
            AddHeaders("Cache-Control", "no-cache");
        }

        protected string[] SplitSearchTerms(string q)
        {
            return q
               .Replace(',', ' ')
               .Split(' ')
               .Select(tt => tt.Trim())
               .ToArray();
        }

    protected IHttpActionResult ExecuteConcurrentValidatedAction<T, TRes>(T ent, Func<T, TRes> updaterFunc, Func<int, T> reloaderFunc) where T : Entity
    {
      try
      {
        return ExecuteValidatedAction(() => Ok(updaterFunc(ent)));
      }
      catch (DbUpdateConcurrencyException dex)
      {
        T reloaded = reloaderFunc(ent.Id);
        if (reloaded == null) return NotFound();
        Logger.Error(Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase) + '\n' + Jil.JSON.Serialize<T>(reloaded, Jil.Options.ISO8601PrettyPrintIncludeInherited), dex);
        return Content(HttpStatusCode.Conflict, reloaded);
      }
    }

    protected IHttpActionResult ExecuteConcurrentValidatedActionGen<T, TRes>(T ent, Func<T, TRes> updaterFunc, Func<int, T> reloaderFunc) where T : class, IEntity
    {
      try
      {
        return ExecuteValidatedAction(() => Ok(updaterFunc(ent)));
      }
      catch (DbUpdateConcurrencyException dex)
      {
        T reloaded = reloaderFunc(ent.Id);
        if (reloaded == null) return NotFound();
        Logger.Error(Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase) + '\n' + Jil.JSON.Serialize<T>(reloaded, Jil.Options.ISO8601PrettyPrintIncludeInherited), dex);
        return Content(HttpStatusCode.Conflict, reloaded);
      }
    }

    protected IHttpActionResult ExecuteConcurrentValidatedAction<T>(int id, Func<IHttpActionResult> updaterFunc, Func<int, T> reloaderFunc) where T : Entity
    {
      try
      {
        return ExecuteValidatedAction(updaterFunc);
      }
      catch (DbUpdateConcurrencyException ex)
      {
        T reloaded = reloaderFunc(id);
        if (reloaded == null) return NotFound();
        Logger.Error(Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase) + '\n' + Jil.JSON.Serialize<T>(reloaded, Jil.Options.ISO8601PrettyPrintIncludeInherited), ex);
        return Content(HttpStatusCode.Conflict, reloaded);
      }
    }

    protected IHttpActionResult ExecuteValidatedAction(Func<IHttpActionResult> func)
    {
      try
      {
        return func();
      }
      catch (ArgumentNullException ex)
      {
        Logger.Error("Bad Request\n" + Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase), ex);
        return BadRequest();
      }
      catch (ValidationException vex)
      {
        this.AddErrorsToModelState(vex);
        Logger.Error(Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase) + '\n' + Newtonsoft.Json.JsonConvert.SerializeObject(ModelState, Newtonsoft.Json.Formatting.Indented), vex);
        return BadRequest(ModelState);
      }
    }

    protected async Task<IHttpActionResult> ExecuteValidatedActionAsync(Func<Task<IHttpActionResult>> func)
    {
      try
      {
        return await func();
      }
      catch (ArgumentNullException ex)
      {
        Logger.Error("Bad Request\n" + Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase), ex);
        return BadRequest();
      }
      catch (ValidationException vex)
      {
        this.AddErrorsToModelState(vex);
        Logger.Error(Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase) + '\n' + Newtonsoft.Json.JsonConvert.SerializeObject(ModelState, Newtonsoft.Json.Formatting.Indented), vex);
        return BadRequest(ModelState);
      }
    }

    protected IHttpActionResult GetById<T>(int id, Func<int, T> get)
    {
      var ent = get(id);
      return ent == null ? (IHttpActionResult)NotFound() : Ok(ent);
    }

    protected IEnumerable<T> GetList<T>(Func<IQueryable<T>> getAll, string orderBy = "Id", string orderDir = "asc", int skip = 0, int take = 12) where T : Entity
    {
      // get our orderBy property, defaulting to Id if not found
      var order = GetOrderBy<T>(orderBy);
      var query = getAll();
      AddTotalCountHeader(query.Count().ToString());
      return query.OrderByDir(order, orderDir).Skip(skip).Take(take);
    }

    /// <summary>
    ///     Dyanmically generates a LambdaExpression through reflection and compiles to a Func
    ///     to use for ordering. This is separated out in case it is needed to page
    ///     related types that aren't the main type T of the controller.
    ///     It has been expanded to supported nested properties.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="orderBy"></param>
    /// <returns>Returns an orderBy function to apply to an IQueryable.</returns>
    protected Func<T, object> GetOrderBy<T>(string orderBy = "Id") where T : Entity
    {
      try
      {
        Type type = typeof(T);
        ParameterExpression arg = Expression.Parameter(type);
        string[] orderBys = orderBy.Split('.'); // support nested properties
        Expression expr = orderBys.Aggregate<string, Expression>(arg, Expression.PropertyOrField);
        return Expression.Lambda<Func<T, object>>(expr, arg).Compile();
      }
      catch (Exception)
      {
        // if a bad param is passed in, just order by the Id
        return t => t.Id;
      }
    }

    protected IHttpActionResult RestoreEntity<T>(int id, Func<int, T> restore)
    {
      T entity = restore(id);
      if (entity == null)
      {
        Logger.Error("Bad id\n" + Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(Request, Jil.Options.PrettyPrintCamelCase));
        return BadRequest("Bad id");
      }
      return Ok(entity);
    }

    public IEnumerable<T> HandleSearchResults<T>(ISearchResults<T> results) where T : class
    {
      if (results == null)
      {
        AddTotalCountHeader("0");
        return new List<T>(0);
      }

      AddTotalCountHeader(results.TotalHits.ToString());
      return results.Results;
    }
  }
}
