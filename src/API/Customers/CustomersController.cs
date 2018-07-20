using API.ControllerBase;
using Model;
using Service;
using Service.Customers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using API.Claims;
using Service.Base;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;
using API.Common;
using API.CRUD;
using Service.Common.Phone;

namespace API.Customers
{
  [RoutePrefix("api/v1/customers")]
  [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
  public class CustomersController : CrudVersionController<Customer>
  {
    private readonly IRequestDocReader _docReader;
    private readonly ICustomerService _service;


    public CustomersController(ICustomerService service, IRequestDocReader docReader, ICRUDService crudservice) : base(crudservice)
    {

      _service = service;
      _docReader = docReader;
      Searchfields = new[] { new CrudSearchFieldType("Name", CrudSearchFieldType.Method.Contains) };
      Searchchildincludes = new[] { "CustomerSource", "CustomerStatus", "CustomerPhones" };
      Getbyincludes = new[] { "CustomerSource", "CustomerStatus", "CustomerPhones", "CustomerAddresses", "CustomerAddresses.Address", "Notes", "Contacts" };
      Orderby = "Name";
    }

    [HttpGet]
    [Route("{custId:int}/detail")]
    public Customer GetCustomerDetail(int custId)
    {
      return _service.GetCustomerDetail(custId);
    }

    public override IEnumerable<Customer> Search(string query = null, int? skip = 0, int? take = 0, string extraparams = null)
    {
      var searchquery = _service.GetCustomers();
      if (!IsBlankQuery(query))
      {
        string[] terms = SplitSearchTerms(query);
        searchquery = searchquery.Where(c =>
            terms.All(t => c.Name.Contains(t) ||
                           c.CustomerPhones.Count > 0 && c.CustomerPhones.Any(cp => cp.Phone.Contains(t) || cp.Extension.Contains(t))
            )
        );
      }

      if (!string.IsNullOrEmpty(extraparams))
      {
        var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraparams));

        if (extras["SourceIds"] != null && extras["SourceIds"].Any())
        {
          IEnumerable<int> sourceIds = extras["SourceIds"].Split(',').Select(System.Int32.Parse).ToList();
          searchquery = searchquery.Where(c => sourceIds.Contains(c.SourceId));
        }

        if (extras["StatusIds"] != null)
        {
          IEnumerable<int> statusIds = extras["StatusIds"].Split(',').Select(System.Int32.Parse).ToList();
          searchquery = searchquery.Where(c => statusIds.Contains(c.StatusId));
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

    [HttpPut]
    [Route("generic")]
    [ResponseType(typeof(byte[]))]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult UpdateCustomer(object data)
    {
      // TODO: integrate this with ExecuteConcurrentValidatedAction() (since 'data' isn't of type 'Entity')
      return Ok(_service.UpdateGeneric(data));
    }

    [HttpGet]
    [Route("{orderBy?}/{orderDir?}/{skip:int?}/{take:int?}")]
    public IEnumerable<Customer> GetAllCustomers(string orderBy = "Id", string orderDir = "asc",
        int skip = 0, int take = 12)
    {
      return GetList(_service.GetCustomers, orderBy, orderDir, skip, take);
    }

    [HttpGet]
    [Route("simple")]
    public IEnumerable<Simplified<Customer>> GetSimpleCustomers()
    {
      return _service.GetSimplifiedCustomers()
          .OrderBy(sc => sc.Name);
    }

    [HttpPut]
    [Route("{custId:int}/phones")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PutCustomerPhones(int custId, PhoneCollection<CustomerPhone> phones)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.MergeCustomerPhones(custId, phones);
        return Ok();
      });
    }

    #region "Notes"

    [HttpDelete]
    [Route("{custId:int}/notes/{noteId:int}")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult DeleteNote(int custId, int noteId)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.DeleteNote(custId, noteId);
        return Ok();
      });
    }

    [HttpPost]
    [Route("{custId:int}/notes")]
    [ResponseType(typeof(int))]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PostNote(int custId, Note note)
    {
      return ExecuteValidatedAction(() => Ok(_service.CreateNote(custId, note)));
    }

    [HttpPut]
    [Route("{custId:int}/notes")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PutNote(int custId, Note note)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.UpdateNote(custId, note);
        return Ok();
      });
    }

    [HttpGet]
    [Route("{custId:int}/notes/_search")]
    public IEnumerable<Note> SearchCustomerNotes(int custId, string query = null, int? skip = 0, int? take = 0, string extraparams = null)
    {
      var notesQuery = _service.GetCustomerNotes(custId);
      if (!IsBlankQuery(query))
      {
        string[] terms = SplitSearchTerms(query);
        notesQuery = notesQuery.Where(qq => terms.All(t => qq.Title.Contains(t) || qq.NoteText.Contains(t)));
      }
      var ct = notesQuery.Count();
      return notesQuery
          .OrderBy(n => n.Title)
          .Skip(skip.GetValueOrDefault())
          .Take(take.GetValueOrDefault())
          .ToSearchResults(ct)
          .Respond(this);
    }
    #endregion

    #region "Addresses"

    [HttpPost]
    [Route("{custId:int}/addresses")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult CreateCustomerAddress(int custId, [FromBody] CustomerAddress address)
    {
      return ExecuteValidatedAction(() => Ok(_service.SaveAddress(custId, address)));
    }

    [HttpPut]
    [Route("{custId:int}/addresses/{addressId:int}")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult UpdateCustomerAddress(int custId, int addressId, [FromBody] CustomerAddress address)
    {
      return ExecuteValidatedAction(() =>
      {
        address.AddressId = addressId;
        address.Address.Id = addressId;

        return Ok(_service.SaveAddress(custId, address));
      });
    }

    [HttpDelete]
    [Route("{custId:int}/addresses/{addressId:int}")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult DeleteCustomerAddress(int custId, int addressId)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.DeleteAddress(custId, addressId);
        return Ok();
      });
    }

    [HttpGet]
    [Route("{custId:int}/addresses/_search")]
    public IEnumerable<CustomerAddress> SearchCustomerAddresses(int custId, string query = null, int? skip = 0, int? take = 0, string extraparams = null)
    {
      var addressesQuery = _service.GetCustomerAddresses(custId);
      if (!IsBlankQuery(query))
      {
        string[] terms = SplitSearchTerms(query);
        addressesQuery = addressesQuery
            .Where(qq => terms.All(t => qq.Address.Address1.Contains(t)
                                        || qq.Address.Address2.Contains(t)
                                        || qq.Address.City.Contains(t)
                                       // || qq.Address.StateCode.Contains(t)
                                        || qq.Address.Zip.Contains(t)
            ));
      }
      var ct = addressesQuery.Count();
      return addressesQuery
          .OrderByDescending(n => n.IsPrimary)
         // .ThenBy(n => n.Address.StateCode)
          .Skip(skip.GetValueOrDefault())
          .Take(take.GetValueOrDefault())
          .ToSearchResults(ct)
          .Respond(this);
    }

    #endregion

    #region "Documents"


    [HttpDelete]
    [Route("{custId:int}/documents/{docId:int}")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult DeleteDoc(int custId, int docId)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.DeleteDocument(custId, docId);
        return Ok();
      });
    }

    [HttpGet]
    [Route("{custId:int}/documents/_search")]
    public IEnumerable<Document> SearchCustomerDocuments(int custId, string query = null, int? skip = 0, int? take = 12, string extraparams = null)
    {
      var docquery = _service.GetCustomerDocuments(custId);
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
    [Route("{custId:int}/documents")]
    [ResponseType(typeof(Document))]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public async Task<IHttpActionResult> UploadDoc(int custId)
    {
      return await ExecuteValidatedActionAsync(async () =>
      {
        var doc = await _docReader.GetDocBytesFromRequest(this);
        var uploadedBy = this.GetUserId();
        var docRec = _service.CreateDocument(custId, doc.FileName, doc.DocBytes, uploadedBy);

        return Ok(docRec);
      });
    }

    [HttpGet]
    [Route("{custId:int}/documents/{docId:int}")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    [OverrideActionFiltersAttribute]
    public HttpResponseMessage GetDocument(int custId, int docId)
    {
        var document = _service.GetDocument(custId, docId);
        var documentfile = _service.GetDocumentBytes(custId, docId);
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

    #region "Contacts"

    [HttpDelete]
    [Route("{custId:int}/contacts/{contactId:int}")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult DeleteContact(int custId, int contactId)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.DeleteContact(custId, contactId);
        return Ok();
      });
    }

    [HttpDelete]
    [Route("{custId:int}/contacts/{contactId:int}/addresses/{addrId:int}")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult DeleteContactAddress(int custId, int contactId, int addrId)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.DeleteContactAddress(custId, contactId, addrId);
        return Ok();
      });
    }

    [HttpGet]
    [Route("contacts/{contactId:int}")]
    [ResponseType(typeof(Contact))]
    public IHttpActionResult GetContactById(int contactId)
    {
      return GetById(contactId, _service.GetContactById);
    }

    [HttpGet]
    [Route("contacts/statuses")]
    public IEnumerable<ContactStatus> GetContactStatuses()
    {
      return _service
          .GetContactStatuses()
          .OrderBy(cs => cs.Sort);
    }

    [HttpPost]
    [Route("{custId:int}/contacts")]
    [ResponseType(typeof(int))]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PostContact(int custId, [FromBody] Contact contact)
    {
      return ExecuteValidatedAction(() => Ok(_service.CreateContact(custId, contact)));
    }

    [HttpPost]
    [Route("{custId:int}/contacts/{contactId:int}/address")]
    [ResponseType(typeof(int))]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PostContactAddress(int custId, int contactId, Address address)
    {
      return ExecuteValidatedAction(() =>
          Ok(_service.CreateContactAddress(custId, contactId, address)));
    }


    [HttpGet]
    [Route("{custId:int}/contacts/_search")]
    public IEnumerable<Contact> SearchContacts(int custId, string query = null, int? skip = 0, int? take = 12, string extraparams = null)
    {

      var contactsQuery = _service.GetCustomerContacts(custId);
      if (!IsBlankQuery(query))
      {
        string[] terms = SplitSearchTerms(query);
        contactsQuery = contactsQuery.Where(cc =>
            terms.All(t => cc.LastName.Contains(t) ||
                cc.FirstName.Contains(t) ||
                cc.Email.Contains(t) ||
                cc.Title.Contains(t) ||
                (cc.Address != null && (
                    cc.Address.Address1.Contains(t) ||
                    cc.Address.Address2.Contains(t) ||
                    cc.Address.City.Contains(t) //||
                    //cc.Address.StateCode.Contains(t)
                )) ||
                (cc.ContactStatus != null && cc.ContactStatus.Name.Contains(t))
            )
        );
      }

      if (!string.IsNullOrEmpty(extraparams))
      {
        var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(extraparams));

        if (extras["StatusIds"] != null)
        {
          IEnumerable<int> statusIds = extras["StatusIds"].Split(',').Select(int.Parse).ToList();
          contactsQuery = contactsQuery.Where(c => statusIds.Contains(c.StatusId));
        }

      }

      var ct = contactsQuery.Count();
      return contactsQuery
          .OrderBy(cc => cc.LastName)
          .ThenBy(cc => cc.FirstName)
          .Skip(skip.GetValueOrDefault())
          .Take(take.GetValueOrDefault())
          .ToSearchResults(ct)
          .Respond(this);
    }

    [HttpPut]
    [Route("{custId:int}/contacts")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PutContact(int custId, Contact contact)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.UpdateContact(contact);
        return Ok();
      });
    }

    [HttpPut]
    [Route("{custId:int}/contacts/{contactId:int}/addresses")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PutContactAddress(int custId, int contactId, [FromBody] Address address)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.UpdateContactAddress(custId, address);
        return Ok();
      });
    }

    [HttpPut]
    [Route("{custId:int}/contacts/{contactId:int}/phones")]
    [Restrict(ClaimTypes.Customers, ClaimValues.FullAccess)]
    public IHttpActionResult PutContactPhones(int custId, int contactId, PhoneCollection<ContactPhone> phones)
    {
      return ExecuteValidatedAction(() =>
      {
        _service.MergeContactPhones(custId, contactId, phones);
        return Ok();
      });
    }


    #endregion



  }


}
