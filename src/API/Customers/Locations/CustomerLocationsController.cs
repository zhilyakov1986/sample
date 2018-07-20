using API.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Model;
using API.CRUD;
using Service.Base;
using API.Common;
using System.Data.Entity;
using System.Net;
using ClaimTypes = API.Claims.ClaimTypes;
using System.Web.Http.Description;
using System.Threading.Tasks;
using API.ControllerBase;
using System.Net.Http;
using System.Net.Http.Headers;
using Service.CustomerLocations;
using Service.Common.Address;
using API.Base.Claims;

namespace API.CustomerLocations
{
    [RoutePrefix("api/v1/customerlocations")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class CustomersLocationsController : CrudVersionController<CustomerLocation>
    {
        private readonly ICRUDService _crudService;
        private readonly IRequestDocReader _docReader;
        private readonly ICustomerLocationService _service;
        

        public CustomersLocationsController(ICustomerLocationService service, IRequestDocReader docReader, ICRUDService crudService) : base(crudService)
        {
            _service = service;
            _crudService = crudService;          
            _docReader = docReader;
            Searchfields = new[] { new CrudSearchFieldType("Name", CrudSearchFieldType.Method.Contains) };
            Searchchildincludes = new[] { "Customer", "ServiceArea", "Address" };
            Getbyincludes = new[] { "Customer", "ServiceArea", "Address" };
            Orderby = "Name";
        }
        public override IEnumerable<CustomerLocation> Search(string query = null, int? skip = 0, int? take = 0, string extraparams = null)
        {
            var searchquery = _crudService.Get<CustomerLocation>(Getbyincludes).AsNoTracking();
            if (!IsBlankQuery(query))
            {
                string[] terms = SplitSearchTerms(query);
                searchquery = searchquery.Where(g =>
                    terms.All(t => g.Name.Contains(t))
                );
            }

            if (!string.IsNullOrEmpty(extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraparams));

                if (extras["ServiceAreaIds"] != null && extras["ServiceAreaIds"].Any())
                {
                    IEnumerable<int> serviceAreaIds = extras["ServiceAreaIds"].Split(',').Select(System.Int32.Parse).ToList();
                    searchquery = searchquery.Where(c => serviceAreaIds.Contains(c.ServiceAreaId));
                }

                if (extras["archived"] != null && extras["archived"].Any())
                {
                    var includeArchived = bool.Parse(extras["archived"]);
                    if (!includeArchived)
                    {
                        searchquery = searchquery.Where(u => !u.Archived);
                    }
                }
            }
            var ct = searchquery.Count();
            return searchquery
                .OrderBy(c => c.Name)
                .Skip(skip.GetValueOrDefault())
                .Take(take.GetValueOrDefault())
                .ToSearchResults(ct)
                .Respond(this);
        }

        // TO DO AZ Find out if I need to implement the put method or base CRUD is fine!
        [HttpPut]
        [Route("generic")]
        [ResponseType(typeof(byte[]))]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        public IHttpActionResult UpdateCustomerLocation(object data)
        {
            return Ok();
        }

        
        [HttpGet]
        [Route("getlocations/{customerId:int}")]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        public IQueryable<CustomerLocation> GetLocationByCustomerId(int customerId)
        {
            return  _service.GetLocationForCustomer(customerId);
        }

        #region "Documents"


        [HttpDelete]
        [Route("{customerLocationId:int}/documents/{docId:int}")]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        public IHttpActionResult DeleteDoc(int customerLocationId, int docId)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.DeleteDocument(customerLocationId, docId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("{customerLocationId:int}/documents/_search")]
        public IEnumerable<Document> SearchCustomerLocationsDocuments(int customerLocationId, string query = null, int? skip = 0, int? take = 12, string extraparams = null)
        {
            var docquery = _service.GetCustomerLocationDocuments(customerLocationId);
            if (!IsBlankQuery(query))
            {
                string[] terms = SplitSearchTerms(query);
                docquery = docquery.Where(d => terms.All(t => d.Name.Contains(t)));
            }
            var ct = docquery.Count();
            return docquery
                .OrderByDescending(d => d.DateUpload)
                .ThenBy(d => d.Name)
                .Skip(skip.GetValueOrDefault())
                .Take(take.GetValueOrDefault())
                .ToSearchResults(ct)
                .Respond(this);
        }

        [HttpPost]
        [Route("{customerLocationId:int}/documents")]
        [ResponseType(typeof(Document))]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        public async Task<IHttpActionResult> UploadDoc(int customerLocationId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var doc = await _docReader.GetDocBytesFromRequest(this);
                var uploadedBy = this.GetUserId();
                var docRec = _service.CreateDocument(customerLocationId, doc.FileName, doc.DocBytes, uploadedBy);

                return Ok(docRec);
            });
        }

        [HttpGet]
        [Route("{customerLocationId:int}/documents/{docId:int}")]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        [OverrideActionFiltersAttribute]
        public HttpResponseMessage GetDocument(int customerLocationId, int docId)
        {
            var document = _service.GetDocument(customerLocationId, docId);
            var documentfile = _service.GetDocumentBytes(customerLocationId, docId);
            if (document == null || documentfile == null) return new HttpResponseMessage(HttpStatusCode.BadRequest);

            const HttpStatusCode statuscode = HttpStatusCode.OK;
            var response = Request.CreateResponse(statuscode);
            response.Content = new StreamContent(new System.IO.MemoryStream(documentfile));
            response.Content.Headers.ContentLength = documentfile.Length;
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = document.Name
            };
            response.Content.Headers.ContentDisposition.FileName = document.Name;
            response.Content.Headers.ContentLength = documentfile.Length;
            response.Headers.Add("fileName", document.Name);

            return response;
        }

        #endregion

        #region "Addresses like Users"

        [HttpDelete]
        [Route("{custLocId:int}/address")]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        public IHttpActionResult DeleteAddress(int custLocId)
        {
            return ExecuteConcurrentValidatedAction(custLocId, () =>
            {
                _service.DeleteAddress(custLocId);
                return Ok();
            }, _service.Reload);
        }

        [HttpPost]
        [Route("{custLocId:int}/address")]
        [ResponseType(typeof(CreateAddressResult))]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        public IHttpActionResult PostCustomerAddress(int custLocId, Address address)
        {
            return ExecuteConcurrentValidatedAction(custLocId,
                () => Ok(_service.CreateAddress(custLocId, address)),
                _service.Reload);
        }

        [HttpPut]
        [Route("{custLocId:int}/address/{addressId:int}")]
        [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        [AllowSelfEdit]
        public IHttpActionResult UpdateAddress(int custLocId, Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.UpdateAddress(address);
                return Ok();
            });
        }
        #endregion

        #region "Addresses"

        //[HttpPost]
        //[Route("{custLocId:int}/addresses")]
        //[Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        //public IHttpActionResult CreateCustomerLocationAddress(int custLocId, [FromBody] CustomerLocationAddress address)
        //{
        //    return ExecuteValidatedAction(() => Ok(_service.SaveAddress(custLocId, address)));
        //}

        //[HttpPut]
        //[Route("{custLocId:int}/addresses/{addressId:int}")]
        //[Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        //public IHttpActionResult UpdateCustomerLocationAddress(int custLocId, int addressId, [FromBody] CustomerLocationAddress address)
        //{
        //    return ExecuteValidatedAction(() =>
        //    {
        //        address.AddressId = addressId;
        //        address.Address.Id = addressId;

        //        return Ok(_service.SaveAddress(custLocId, address));
        //    });
        //}

        //[HttpDelete]
        //[Route("{custLocId:int}/addresses/{addressId:int}")]
        //[Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
        //public IHttpActionResult DeleteCustomerAddress(int custLocId, int addressId)
        //{
        //    return ExecuteValidatedAction(() =>
        //    {
        //        _service.DeleteAddress(custLocId, addressId);
        //        return Ok();
        //    });
        //}

        //[HttpGet]
        //[Route("{custLocId:int}/addresses/_search")]
        //public IEnumerable<CustomerLocationAddress> SearchCustomerLocationAddresses(int custLocId, string query = null, int? skip = 0, int? take = 0, string extraparams = null)
        //{
        //    var addressesQuery = _service.GetCustomerLocationAddresses(custLocId);
        //    if (!IsBlankQuery(query))
        //    {
        //        string[] terms = SplitSearchTerms(query);
        //        addressesQuery = addressesQuery
        //            .Where(qq => terms.All(t => qq.Address.Address1.Contains(t)
        //                                        || qq.Address.Address2.Contains(t)
        //                                        || qq.Address.City.Contains(t)
        //                                        // || qq.Address.StateCode.Contains(t)
        //                                        || qq.Address.Zip.Contains(t)
        //            ));
        //    }
        //    var ct = addressesQuery.Count();
        //    return addressesQuery
        //        .OrderByDescending(n => n.IsPrimary)
        //        // .ThenBy(n => n.Address.StateCode)
        //        .Skip(skip.GetValueOrDefault())
        //        .Take(take.GetValueOrDefault())
        //        .ToSearchResults(ct)
        //        .Respond(this);
        //}
        #endregion
    }
}
