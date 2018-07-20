using System;
using System.Reflection;
using log4net;
using Microsoft.Owin.Hosting;
using Service.Utilities;
using Topshelf;

namespace API
{
    public class ApiService : ServiceControl
    {
        private static readonly ILog Logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        private IDisposable _app;

        /// <summary>
        ///      Runs the program interactively.
        /// </summary>
        public bool Start(HostControl hostControl)
        {
            try
            {
                var baseAddress = string.Format(AppSettings.GetApiAddress());
                Logger.Info(String.Format("Starting {1} on base address {0}", baseAddress, AppSettings.GetServiceName()));
                _app = WebApp.Start<Startup>(baseAddress);
                Logger.Info(String.Format("API {1} Started: {0}", baseAddress, AppSettings.GetServiceName()));
            }
            catch (Exception ex)
            {
                Logger.Error("Web API Startup Issue", ex);
            }

            return true;
        }

        /// <summary>
        ///      Cleans up app resources by calling dispose.
        /// </summary>
        public bool Stop(HostControl hostControl)
        {
            if (_app == null) return true;
            _app.Dispose();
            _app = null;

            return true;
        }
    }
}