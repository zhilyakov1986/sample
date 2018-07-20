using System.Reflection;
using System.Web.Http.ExceptionHandling;
using log4net;

namespace API.Common
{
    internal class GlobalExceptionLogger : ExceptionLogger
    {
        private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);

        public override System.Threading.Tasks.Task LogAsync(ExceptionLoggerContext context, System.Threading.CancellationToken cancellationToken)
        {
            Logger.Error($"{context.Exception.Source} Exception", context.Exception);
            return base.LogAsync(context, cancellationToken);
        }
    }
}
