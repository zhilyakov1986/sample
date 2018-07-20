using API.Claims;
using API.ControllerBase;
using log4net;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace API.Logging
{
  [RoutePrefix("api/v1/logger")]
  public class LoggerController : ApiControllerBase
  {
    private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

    [HttpPost]
    [AllowAnonymous]
    [Route("errors")]
    [ResponseType(typeof(int))]
    public IHttpActionResult PostError([FromBody] LoggerParams stack)
    {
      Logger.Error(Jil.JSON.Serialize<LoggerParams>(stack, Jil.Options.ISO8601PrettyPrintIncludeInherited));
      return ExecuteValidatedAction(() => Ok());
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("debug")]
    [ResponseType(typeof(int))]
    public IHttpActionResult PostDebug([FromBody] LoggerParams stack)
    {
      Logger.Debug(Jil.JSON.Serialize<LoggerParams>(stack, Jil.Options.ISO8601PrettyPrintIncludeInherited));
      return ExecuteValidatedAction(() => Ok());
    }
    
  }

  internal class Log
  {

    private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
    public static void Error(string message)
    {
      Logger.Error(message);
    }

    public static void Debug(string message)
    {
      Logger.Debug(message);
    }

    public static void Info(string message)
    {
      Logger.Info(message);
    }

    public static void Warn(string message)
    {
      Logger.Warn(message);
    }

    public static void Fatal(string message)
    {
      Logger.Fatal(message);
    }
  }

}
