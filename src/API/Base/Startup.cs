using System.Reflection;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using API.Common;
using API.Jwt;
using API.RoleManager;
using Autofac;
using Autofac.Integration.WebApi;
using log4net.Config;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
using Service;
using Service.Utilities;

[assembly: XmlConfigurator(ConfigFile = "l4n.config", Watch = true)]

namespace API
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Configure Web API for self-host.
            var config = new HttpConfiguration();

            // Register modules and types
            var builder = new ContainerBuilder();
            builder.RegisterModule(new ServiceModule());
            builder.RegisterModule(new EfModule());
            builder.RegisterModule(new ValidatorModule());
            builder.RegisterModule(new DtoValidationModule());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterType<RequestDocReader>().As<IRequestDocReader>();
            builder.RegisterType<InMemoryRoleManager>().As<IRoleManager>().SingleInstance();

            // Register service handles
            config.Services.Add(typeof(IExceptionLogger), new GlobalExceptionLogger());

            // Uncomment if you want to start injecting / registering filters as well
            builder.RegisterWebApiFilterProvider(config);

            // Build container
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            // The Autofac middleware must go before any Web Api middleware
            app.UseAutofacMiddleware(container);
            app.UseAutofacWebApi(config);
            WebApiConfig.Register(config, container);

            // Non-Autofac OWIN pipeline
            app.UseJsonWebTokens();
            app.UseRoleManager(container.Resolve<IRoleManager>());
            app.UseWebApi(config);

            // Ensures configuration is ready
            config.EnsureInitialized();

            // sets up doc serving
            app.UseStaticFiles(GetStaticFileOpts());

        }

        /// <summary>
        ///     Creates static file options for serving docs.
        /// </summary>
        private static StaticFileOptions GetStaticFileOpts()
        {
            var root = AppSettings.GetDocsRootDirectory();
            var fileSystem = new PhysicalFileSystem(root);
            var options = new StaticFileOptions
            {
                FileSystem = fileSystem,
                RequestPath = new PathString("/docs")
            };
            return options;
        }
    }
}
