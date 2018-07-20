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
using Service.LocationServices;

namespace API.LocationServices
{
    [RoutePrefix("api/v1/locationservices")]
    [Restrict(ClaimTypes.Contracts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class LocationServicesController: CrudVersionController<Model.LocationService>
    {
        private readonly IRequestDocReader _docReader;
        private readonly ILocationService _service;
        private readonly ICRUDService _crudService;

        public LocationServicesController(ILocationService service, IRequestDocReader docReader, ICRUDService crudservice) : base(crudservice)
        {
            _service = service;
            _crudService = crudservice;
            _docReader = docReader;
            Searchfields = new[] { new CrudSearchFieldType("Id", CrudSearchFieldType.Method.Contains) };
            Searchchildincludes = new[] { "CustomerLocation", "Good", "Contract" };;
            Getbyincludes = new[] { "CustomerLocation", "Good", "Contract", "Good.UnitType" };
            Orderby = "Id";
        }
        public override IEnumerable<Model.LocationService> Search(string query = null, int? skip = 0, int? take = 0, string extraparams = null)
        {
            var searchquery = _crudService.Get<Model.LocationService>(Getbyincludes).AsNoTracking();
            if (!IsBlankQuery(query))
            {
                string[] terms = SplitSearchTerms(query);
                searchquery = searchquery.Where(ls =>
                    terms.All(t => ls.CustomerLocation.Name.Contains(t))
                );
            }
            if (!string.IsNullOrEmpty(extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraparams));

                if (extras["ServiceTypeIds"] != null && extras["ServiceTypeIds"].Any())
                {
                    IEnumerable<int> serviceTypeIds = extras["ServiceTypeIds"].Split(',').Select(System.Int32.Parse).ToList();
                    searchquery = searchquery.Where(c => serviceTypeIds.Contains(c.Good.ServiceTypeId));
                }

                if (extras["archived"] != null && extras["archived"].Any())
                {
                    var includeArchived = bool.Parse(extras["archived"]);
                    if (!includeArchived)
                    {
                        searchquery = searchquery.Where(u => !u.Archived);
                    }
                }
                if (extras["services"] != null && extras["services"].Any())
                {
                    string termService = extras["services"];
                    searchquery = searchquery.Where(s => s.Good.Name.Contains(termService));
                }
                if (extras["city"] != null && extras["city"].Any())
                {
                    string termCity = extras["city"];
                    searchquery = searchquery.Where(s => s.CustomerLocation.Address.City.Contains(termCity));
                }
                if (extras["state"] != null && extras["state"].Any())
                {
                    string termState = extras["state"];
                    searchquery = searchquery.Where(s => s.CustomerLocation.Address.State.Name.Contains(termState));
                }
                if (extras["zip"] != null && extras["zip"].Any())
                {
                    string termZip = extras["zip"];
                    searchquery = searchquery.Where(s => s.CustomerLocation.Address.Zip.Contains(termZip));
                }
            }

            var ct = searchquery.Count();
            return searchquery
                .OrderBy(c => c.Id)
                .Skip(skip.GetValueOrDefault())
                .Take(take.GetValueOrDefault())
                .ToSearchResults(ct)
                .Respond(this);
        }
        [HttpPut]
        [Route("archive/{locationId:int}")]
        public IHttpActionResult ToggleArchive(int locationId)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.ToggleArchive(locationId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("getalltaxes")]
        public Dictionary<int,decimal> GetAllTaxes()
        {
            return _service.GetAllTaxes();
        }

        [HttpGet]
        [Route("getalltotals")]
        public Dictionary<int, decimal> GetAllTotals()
        {
            return _service.GetAllTotals();
        }


        [HttpGet]
        [Route("gettaxrate/{addressId:int}")]
        public decimal GetStateTaxRate(int addressId)
        {
            return _service.GetStateTaxRate(addressId);
        }

        [HttpGet]
        [Route("gettotal/{locationId:int}")]
        public decimal GetTotal(int locationId)
        {
            return _service.GetTotal(locationId);
        }

        [HttpGet]
        [Route("gettax/{locationServiceId:int}")]
        public decimal GetTaxForService(int locationServiceId)
        {
            return _service.GetTaxForService(locationServiceId);
        }

        [HttpGet]
        [Route("gettotalline/{locationServiceId:int}")]
        public decimal GetTotalLineItem(int locationServiceId)
        {
            return _service.GetTotalLineItem(locationServiceId);
        }

        [HttpGet]
        [Route("servicesforlocation/{locationId:int}")]
        public List<Model.LocationService> GetServicesForLocation(int locationId)
        {
            return _service.GetServicesForLocation(locationId);
                
        }

        [HttpGet]
        [Route("customservicelocation/{locationId:int}")]
        public Model.LocationService GetCustomServiceLocation(int locationId)
        {
            return _service.GetCustomServiceLocation(locationId);
                
        }

        public override IHttpActionResult Delete(int id)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.DeleteLocationService(id);
                return Ok();
            });
        }
    }
}
