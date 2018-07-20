using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using API.Claims;
using Service.Base;
using API.CRUD;
using Model;
using Service.Goods;
using API.Common;
using System.Net;
using System.Data.Entity;
using ClaimTypes = API.Claims.ClaimTypes;
using System.Web.Http.Description;
using System.Threading.Tasks;
using API.ControllerBase;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Globalization;
using Service.Contracts;

namespace API.Contracts
{
    [RoutePrefix("api/v1/contracts")]
    [Restrict(ClaimTypes.Contracts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ContractsController: CrudVersionController<Contract>
    {
        private readonly IRequestDocReader _docReader;
        private readonly IContractService _service;
        private readonly ICRUDService _crudService;

        public ContractsController(IContractService service, IRequestDocReader docReader, ICRUDService crudservice) : base(crudservice)
        {
            _service = service;
            _crudService = crudservice;
            _docReader = docReader;
            Searchfields = new[] { new CrudSearchFieldType("Number", CrudSearchFieldType.Method.Contains) };
            Searchchildincludes = new[] { "Customer", "ContractStatus", "ServiceDivision", "User" };
            Getbyincludes = new[] { "Customer", "ContractStatus", "ServiceDivision", "ServiceAreas", "User" };
            Orderby = "Number";
        }

        #region Search
        public override IEnumerable<Contract> Search(string query = null, int? skip = 0, int? take = 0, string extraparams = null)
        {
            var searchquery = _crudService.Get<Contract>(Getbyincludes).AsNoTracking();
            if (!IsBlankQuery(query))
            {
                string[] terms = SplitSearchTerms(query);
                searchquery = searchquery.Where(c =>
                    terms.All(t => c.Number.Contains(t))
                );
            }

            if (!string.IsNullOrEmpty(extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraparams));

                if (extras["ServiceDivisionIds"] != null && extras["ServiceDivisionIds"].Any())
                {
                    IEnumerable<int> serviceDivisionIds = extras["ServiceDivisionIds"].Split(',').Select(System.Int32.Parse).ToList();
                    searchquery = searchquery.Where(c => serviceDivisionIds.Contains(c.ServiceDivisionId));
                }
                if (extras["ContractStatusIds"] != null && extras["ContractStatusIds"].Any())
                {
                    IEnumerable<int> ContractStatusIds = extras["ContractStatusIds"].Split(',').Select(System.Int32.Parse).ToList();
                    searchquery = searchquery.Where(c => ContractStatusIds.Contains(c.StatusId));
                }

                if (extras["archived"] != null && extras["archived"].Any())
                {
                    var includeArchived = bool.Parse(extras["archived"]);
                    if (!includeArchived)
                    {
                        searchquery = searchquery.Where(u => !u.Archived);
                    }
                }

                if (extras["OrderDateStart"] != null && extras["OrderDateEnd"]!= null)
                {
                    var hasOrderDateStart = System.DateTime.TryParseExact(
                        extras["OrderDateStart"],
                        "MM-dd-yyyy",
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.None, out var orderDateStart);
                    var hasOrderDateEnd = System.DateTime.TryParseExact(
                        extras["OrderDateEnd"],
                        "MM-dd-yyyy",
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.None, out var orderDateEnd);
                    if(hasOrderDateStart && hasOrderDateEnd)
                    {
                        searchquery = searchquery
                            .Where(c => DbFunctions.TruncateTime(orderDateStart) <= DbFunctions.TruncateTime(c.StartDate))
                            .Where(c => DbFunctions.TruncateTime(orderDateEnd) >= DbFunctions.TruncateTime(c.EndDate));
                    }
                }

            }
            var ct = searchquery.Count();
            return searchquery
                .OrderBy(c => c.Number)
                .Skip(skip.GetValueOrDefault())
                .Take(take.GetValueOrDefault())
                .ToSearchResults(ct)
                .Respond(this);
        }
        #endregion

        #region CRUD logic




        // TO DO AZ Find out if I need to implement the put method or base CRUD is fine!
        [HttpPut]
        [Route("generic")]
        [ResponseType(typeof(byte[]))]
        [Restrict(ClaimTypes.Contracts, ClaimValues.FullAccess)]
        public IHttpActionResult UpdateContract(object data)
        {
            return Ok();
        }
        #endregion

        #region non-crud logic
        /// <summary>
        /// Overrides base create method to attach generated customer number
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public override IHttpActionResult Create([FromBody] Contract data)
        {
            data.Number = _service.GenereateContractNumber(data.CustomerId);
            return ExecuteValidatedAction(() => Ok(_service.CreateContract(data)));
        }

        /// <summary>
        /// Overrides base update method to attach generated customer number
        /// </summary>
        /// <param name="id"></param>
        /// <param name="data"></param>
        /// <returns></returns>
        public override IHttpActionResult Update(int id, [FromBody] Contract data)
        {

            data = SetUpdateFields(data);
            //data.ServiceAreas = null;
            return ExecuteValidatedAction(() =>
            {
                _service.UpdateContract(data);
                return Ok();
            });
        }


        [HttpGet]
        [Route("getuserrole/{userId:int}")]
        public int GetUserRoleId(int userId)
        {
            return _service.GetUserRole(userId);
        }
        #endregion
    }
}
