using API.Users;
using Autofac;
using Newtonsoft.Json;
using System.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;
using API.Attributes;
using API.Csrf;

namespace API
{
    public static class WebApiConfig
    {
        private const string CorsHeaders = "X-List-Count,X-Update-Roles";

        public static void Register(HttpConfiguration config, IContainer container)
        {
            DealWithCors(config);
            OverrideFormatters(config);
            AddFilters(config);
            SetupRoutes(config);
            log4net.Config.XmlConfigurator.Configure();
        }

        /// <summary>
        ///      Apply any filters that should run for every request.
        /// </summary>
        /// <param name="config"></param>
        private static void AddFilters(HttpConfiguration config)
        {
            config.Filters.Add(new CsrfValidationFilter());
            config.Filters.Add(new ValidateModelFilter());
            config.Filters.Add(new CompressionFilter());
            config.Filters.Add(new AuthorizeAttribute());
        }

        /// <summary>
        ///      Enables CORS for whatever front-end origin you need.
        /// </summary>
        /// <param name="config"></param>
        private static void DealWithCors(HttpConfiguration config)
        {
            // enable cors
            var corsAddress = ConfigurationManager.AppSettings["AdminSite"];
            var corsAttribute = new EnableCorsAttribute(corsAddress, "*", "*", CorsHeaders);
            config.EnableCors(corsAttribute);
        }

        /// <summary>
        ///      Overrides any default formatters as desired. Can't replace with Jil anymore :(
        /// </summary>
        /// <param name="config"></param>
        private static void OverrideFormatters(HttpConfiguration config)
        {
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            config.Formatters.Add(new UserCsvFormatter());
        }

        /// <summary>
        ///      Sets up routing patterns for the API.
        ///      NOTE: change the version here!!!
        /// </summary>
        /// <param name="config"></param>
        private static void SetupRoutes(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes(new CustomDirectRouteProvider());
            config.Routes.MapHttpRoute("DefaultApi", "api/v{version}/{controller}/{id}",
                new { id = RouteParameter.Optional });
        }
    }
}
