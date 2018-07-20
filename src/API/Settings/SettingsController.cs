using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using API.Claims;
using API.ControllerBase;
using Model;
using Service.Settings;

namespace API.Settings
{
    [RoutePrefix("api/v1/settings")]
    [Restrict(ClaimTypes.AppSettings, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class SettingsController : ApiControllerBase
    {
        private readonly ISettingsService _service;

        public SettingsController(ISettingsService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("")]
        [Bypass(true)] // company settings need to be retrievable by all
        public IEnumerable<Setting> GetSettings()
        {
            return _service.GetSettings();
        }

        [HttpGet]
        [Route("{settingId:int}")]
        [ResponseType(typeof(Setting))]
        public IHttpActionResult GetSettingById(int settingId)
        {
            return GetById(settingId, _service.GetSetting);
        }

        [HttpPut]
        [Route("")]
        [Restrict(ClaimTypes.AppSettings, ClaimValues.FullAccess)]
        public IHttpActionResult PutSetting(Setting setting)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.UpdateSetting(setting);
                return Ok();
            });
        }

        [HttpPut]
        [Route("batch")]
        [Restrict(ClaimTypes.AppSettings, ClaimValues.FullAccess)]
        public IHttpActionResult BatchPutSettings(IEnumerable<Setting> settings)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.UpdateSettings(settings);
                return Ok();
            });
        }
    }
}
