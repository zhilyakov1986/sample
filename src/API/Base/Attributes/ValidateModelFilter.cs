using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using log4net;

namespace API.Attributes
{
    /// <summary>
    ///     This filter checks the model state for us, so we don't need to in controllers anymore...
    /// </summary>
    public class ValidateModelFilter : ActionFilterAttribute
    {

    private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
    public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (actionContext.ModelState.IsValid == false)
            {
        Logger.Error("Model State Invalid\n" + Jil.JSON.Serialize<System.Net.Http.HttpRequestMessage>(actionContext.Request, Jil.Options.PrettyPrintCamelCase));
        Logger.Debug(Newtonsoft.Json.JsonConvert.SerializeObject(actionContext.ModelState));
        actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    actionContext.ModelState);
            }
        }
    }
}
