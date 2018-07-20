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

namespace API.Goods
{
    [RoutePrefix("api/v1/goods")]
    [Restrict(ClaimTypes.Services, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    
    public class GoodsController: CrudVersionController<Good>
    {
        private readonly IRequestDocReader _docReader;
        private readonly IGoodService _service;
        private readonly ICRUDService _crudService;

        public GoodsController(IGoodService service, IRequestDocReader docReader, ICRUDService crudservice) : base(crudservice)
        {
            _service = service;
            _crudService = crudservice;
            _docReader = docReader;
            Searchfields = new[] { new CrudSearchFieldType("Name", CrudSearchFieldType.Method.Contains) };
            Searchchildincludes = new[] { "ServiceDivision", "ServiceType", "UnitType" };
            Getbyincludes = new[] { "ServiceDivision", "ServiceType", "UnitType" };
            Orderby = "Name";
        }

        [HttpPut]
        [Route("generic")]
        [ResponseType(typeof(byte[]))]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        public IHttpActionResult UpdateGood(object data)
        {
            return Ok(_service.UpdateGeneric(data));
        }

        #region "Search"

        public override IEnumerable<Good> Search(string query = null, int? skip = 0, int? take = 0, string extraparams = null)
        {
            var searchquery = _crudService.Get<Good>(Getbyincludes).AsNoTracking();
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

                if (extras["ServiceTypeIds"] != null && extras["ServiceTypeIds"].Any())
                {
                    IEnumerable<int> serviceTypeIds = extras["ServiceTypeIds"].Split(',').Select(System.Int32.Parse).ToList();
                    searchquery = searchquery.Where(c => serviceTypeIds.Contains(c.ServiceTypeId));
                }

                if (extras["ServiceDivisionIds"] != null && extras["ServiceDivisionIds"].Any())
                {
                    IEnumerable<int> serviceDivisionIds = extras["ServiceDivisionIds"].Split(',').Select(System.Int32.Parse).ToList();
                    searchquery = searchquery.Where(c => serviceDivisionIds.Contains(c.ServiceDivisionId));
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
        #endregion

        #region "Documents"


        [HttpDelete]
        [Route("{goodId:int}/documents/{docId:int}")]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        public IHttpActionResult DeleteDoc(int goodId, int docId)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.DeleteDocument(goodId, docId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("{goodId:int}/documents/_search")]
        public IEnumerable<Document> SearchGoodsDocuments(int goodId, string query = null, int? skip = 0, int? take = 12, string extraparams = null)
        {
            var docquery = _service.GetGoodDocuments(goodId);
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
        [Route("{goodId:int}/documents")]
        [ResponseType(typeof(Document))]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        public async Task<IHttpActionResult> UploadDoc(int goodId)
        {
            return await ExecuteValidatedActionAsync(async () =>
            {
                var doc = await _docReader.GetDocBytesFromRequest(this);
                var uploadedBy = this.GetUserId();
                var docRec = _service.CreateDocument(goodId, doc.FileName, doc.DocBytes, uploadedBy);

                return Ok(docRec);
            });
        }

        [HttpGet]
        [Route("{goodId:int}/documents/{docId:int}")]
        [Restrict(ClaimTypes.Services, ClaimValues.FullAccess)]
        [OverrideActionFiltersAttribute]
        public HttpResponseMessage GetDocument(int goodId, int docId)
        {
            var document = _service.GetDocument(goodId, docId);
            var documentfile = _service.GetDocumentBytes(goodId, docId);
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
    }

}
