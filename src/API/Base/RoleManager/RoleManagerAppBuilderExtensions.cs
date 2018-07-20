using Owin;

namespace API.RoleManager
{
    public static class RoleManagerAppBuilderExtensions
    {
        /// <summary>
        ///     Tells OWIN pipeline to use our RoleManager
        ///     to check claim times against latest role state.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="roleManager"></param>
        /// <returns></returns>
        public static IAppBuilder UseRoleManager(this IAppBuilder app, IRoleManager roleManager)
        {
            app.Use<RoleManagerAuthorization>(roleManager);
            return app;
        }
    }
}