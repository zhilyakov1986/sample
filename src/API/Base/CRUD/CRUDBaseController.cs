using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Http;
using System.Web.Http.Description;
using API.Claims;
using API.Common;
using API.ControllerBase;
using Model;
using Newtonsoft.Json;
using Service.Base;

namespace API.CRUD
{
    public abstract class CrudBaseController<T> : ApiControllerBase where T : class, IEntity, new()
    {

        protected readonly ICRUDService Crudservice;
        protected CrudSearchFieldType[] Searchfields;
        protected string[] Searchchildincludes;
        protected string[] Getbyincludes;
        protected string Orderby = "Name";

        protected CrudBaseController(ICRUDService crudservice)
        {
            Crudservice = crudservice;
        }

        #region "Methods"

        protected T SetCreateFields(T data)
        {
            var cby = typeof(T).GetProperty("CreatedBy");
            if (cby != null) cby.SetValue(data, this.GetUserId());

            var dcd = typeof(T).GetProperty("DateCreated");
            if (dcd != null) dcd.SetValue(data, DateTime.UtcNow);

            var mdf = typeof(T).GetProperty("ModifiedBy");
            if (mdf != null) mdf.SetValue(data, null);

            var dmd = typeof(T).GetProperty("DateModified");
            if (dmd != null) dmd.SetValue(data, null);

            return data;
        }

        protected T SetUpdateFields(T data)
        {

            var cby = typeof(T).GetProperty("CreatedBy");
            if (cby != null) cby.SetValue(data, null);

            var dcd = typeof(T).GetProperty("DateCreated");
            if (dcd != null) dcd.SetValue(data, null);

            var mdf = typeof(T).GetProperty("ModifiedBy");
            if (mdf != null) mdf.SetValue(data, this.GetUserId());

            var dmd = typeof(T).GetProperty("DateModified");
            if (dmd != null) dmd.SetValue(data, DateTime.UtcNow);

            return data;
        }

        protected IEnumerable<T> SetUpdateFields(IEnumerable<T> list)
        {

            var createdbyreset = false;
            var datecreatedreset = false;
            var modifiedbyupdate = false;
            var datemodifiedupdate = false;
            var userid = this.GetUserId();
            var current = DateTime.UtcNow;


            var cby = typeof(T).GetProperty("CreatedBy");
            if (cby != null) createdbyreset = true;

            var dcd = typeof(T).GetProperty("DateCreated");
            if (dcd != null) datecreatedreset = true;

            var mdf = typeof(T).GetProperty("ModifiedBy");
            if (mdf != null) modifiedbyupdate = true;

            var dmd = typeof(T).GetProperty("DateModified");
            if (dmd != null) datemodifiedupdate = true;

            if (!createdbyreset && !datecreatedreset && !modifiedbyupdate && !datemodifiedupdate) return list;
            var updateFields = list as IList<T> ?? list.ToList();
            foreach (var data in updateFields)
            {
                if (createdbyreset) cby.SetValue(data, null);
                if (datecreatedreset) dcd.SetValue(data, null);
                if (modifiedbyupdate) mdf.SetValue(data, userid);
                if (datemodifiedupdate) dmd.SetValue(data, current);

            }

            return updateFields;
        }

        protected string SetUpdateFields(string data)
        {

            var json = Newtonsoft.Json.Linq.JObject.Parse(data);

            var cby = json.Property("CreatedBy");
            if (cby != null) cby.Value = null;

            var dcd = json.Property("DateCreated");
            if (dcd != null) dcd.Value = null;

            var mdf = json.Property("ModifiedBy");
            if (mdf != null)
            {
                mdf.Value = this.GetUserId();
            }
            else
            {
                json.Add("ModifiedBy", this.GetUserId());
            }

            var dmd = json.Property("DateModified");
            if (dmd != null)
            {
                dmd.Value = DateTime.UtcNow;
            }
            else
            {
                json.Add("DateModified", DateTime.UtcNow);
            }

            return json.ToString(Formatting.None);
        }


        #endregion

        #region "C"

        [HttpPost]
        [Route("")]
        [ResponseType(typeof(int))]
        [Restrict(ClaimValues.FullAccess)]
        public virtual IHttpActionResult Create([FromBody] T data)
        {

            data = SetCreateFields(data);

            return ExecuteValidatedAction(() => Ok(Crudservice.Create(data)));
        }

        #endregion

        #region "R"
        [HttpGet]
        [Route("_search")]
        public virtual IEnumerable<T> Search(string query = null, int? skip = 0, int? take = 0, string extraparams = null)
        {
            var searchquery = Crudservice.Get<T>();
            if (Searchchildincludes != null && Searchchildincludes.Length > 0)
            {
                searchquery = Searchchildincludes.Aggregate(searchquery, (current, t) => current.Include(t));
            }

            var parameter = Expression.Parameter(typeof(T));
            if (!IsBlankQuery(query) && Searchfields.Length > 0)
            {
                var terms = SplitSearchTerms(query);
                var final = Enumerable.Empty<T>().AsQueryable();
                var searchResults = Enumerable.Empty<T>().AsQueryable();
                foreach (var t in terms)
                {
                    foreach (var searchfield in Searchfields)
                    {
                        switch (searchfield.Comparetype)
                        {
                            case CrudSearchFieldType.Method.Equals:
                                //Equals
                                var expression = Expression.Lambda<Func<T, bool>>(
                                  Expression.Equal(Expression.MakeMemberAccess(parameter, typeof(T).GetProperty(searchfield.Name)),
                                    Expression.Constant(t)), parameter);
                                searchResults = searchquery.Where(expression);
                                break;
                            case CrudSearchFieldType.Method.Contains:
                                //Contains
                                var method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                                if (method != null)
                                {
                                    var expressionBody = Expression.Call(Expression.Property(parameter, searchfield.Name), method,
                                      Expression.Constant((t)));

                                    searchResults = searchquery.Where(Expression.Lambda<Func<T, bool>>(expressionBody, parameter));
                                }
                                break;
                            default:
                                throw new ArgumentOutOfRangeException();
                        }
                        final = searchResults.Union(final);
                    }
                }
                searchquery = final;
            }

            Expression orderByProperty = Expression.Property(parameter, Orderby);
            searchquery = orderByProperty.Type == typeof(int) ?
                searchquery.OrderBy(GetOrderByExpressionInt(parameter, orderByProperty)) :
                searchquery.OrderBy(GetOrderByExpressionString(parameter, orderByProperty));

            var ct = searchquery.Count();

            if (take > 0)
            {
                searchquery = searchquery.Skip(skip.GetValueOrDefault()).Take(take.GetValueOrDefault());
            }

            return searchquery
                .ToSearchResults<T>(ct)
                .Respond<T>(this);
        }

        private static Expression<Func<T, int>> GetOrderByExpressionInt(ParameterExpression parameter, Expression orderByProperty)
        {
            return Expression.Lambda<Func<T, int>>
                (orderByProperty, new[] { parameter }); ;
        }

        private static Expression<Func<T, string>> GetOrderByExpressionString(ParameterExpression parameter, Expression orderByProperty)
        {
            return Expression.Lambda<Func<T, string>>
                (orderByProperty, new[] { parameter }); ;
        }

        [HttpGet]
        [Route("{id:int}")]
        public virtual T GetById(int id)
        {
            return Getbyincludes != null && Getbyincludes.Length > 0 ? Crudservice.GetById<T>(id, Getbyincludes) : Crudservice.GetById<T>(id);
        }


        [HttpGet]
        [Route("")]
        public virtual IEnumerable<T> GetAll()
        {

            var parameter = Expression.Parameter(typeof(T));
            Expression orderByProperty = Expression.Property(parameter, Orderby);
            var orderByExpression = Expression.Lambda<Func<T, string>>
                (orderByProperty, new[] { parameter });

            return Getbyincludes != null && Getbyincludes.Length > 0
                ? Crudservice.Get<T>(Getbyincludes).OrderBy(orderByExpression).AsEnumerable<T>()
                : Crudservice.Get<T>().OrderBy(orderByExpression).AsEnumerable<T>();

        }

        #endregion

        #region "U"

        [HttpPut]
        [Route("{id:int}")]
        [Restrict(ClaimValues.FullAccess)]
        public virtual IHttpActionResult Update(int id, [FromBody] T data)
        {

            data = SetUpdateFields(data);

            return ExecuteValidatedAction(() =>
            {
                Crudservice.Update(data);
                return Ok();
            });
        }

        [HttpPatch]
        [Route("{id:int}")]
        [Restrict(ClaimValues.FullAccess)]
        public IHttpActionResult UpdatePartial([FromBody] string data)
        {
            data = SetUpdateFields(data);

            // TODO: integrate this with ExecuteConcurrentValidatedAction() (since 'data' isn't of type 'Entity')
            return ExecuteValidatedAction(() =>
            {
                Crudservice.Update<T>(data);
                return Ok();
            });
        }

        [HttpPut]
        [Route("")]
        [Restrict(ClaimValues.FullAccess)]
        public virtual IHttpActionResult UpdateList([FromBody] IEnumerable<T> list)
        {

            list = SetUpdateFields(list);

            return ExecuteValidatedAction(() =>
            {
                Crudservice.Update(list);
                return Ok();
            });
        }

        #endregion

        #region "D"

        [HttpDelete]
        [Route("{id:int}")]
        [Restrict(ClaimValues.FullAccess)]
        public virtual IHttpActionResult Delete(int id)
        {

            return ExecuteValidatedAction(() =>
            {
                Crudservice.Delete<T>(id);
                return Ok();
            });
        }

        #endregion



    }
}
