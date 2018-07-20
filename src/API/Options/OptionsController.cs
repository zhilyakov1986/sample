using System.Collections.Generic;
using System.Web.Http;
using Model;
using Service.Common.Options;

namespace API.Options
{
    [RoutePrefix("api/v1/options")]
    public class OptionsController : ApiController
    {
        private readonly IOptionService _optService;

        public OptionsController(IOptionService service)
        {
            _optService = service;
        }

        [HttpGet]
        [Route("states")]
        public IEnumerable<State> GetStates()
        {
            return _optService.GetStates();
        }

        [HttpGet]
        [Route("countries")]
        public IEnumerable<Country> GetCountries()
        {
            return _optService.GetCountries();
        }


        [HttpGet]
        [Route("phoneTypes")]
        public IEnumerable<PhoneType> GetPhoneTypes()
        {
            return _optService.GetPhoneTypes();
        }

        [HttpGet]
        [Route("contactStatuses")]
        public IEnumerable<ContactStatus> GetContactStatuses()
        {
            return _optService.GetContactStatuses();
        }
    }
}
