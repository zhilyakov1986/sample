using Microsoft.Owin.Extensions;
using Owin;

namespace API.Jwt
{
    public static class JwtiAppBuilderExtensions
    {
        /// <summary>
        ///     Extension method to tell OWIN app to use custom JWT Auth in
        ///     the pipeline.
        /// </summary>
        /// <param name="app"></param>
        public static IAppBuilder UseJsonWebTokens(this IAppBuilder app)
        {
            app.Use<JwtAuthenticaton>();
            app.UseStageMarker(PipelineStage.Authenticate);
            return app;
        }
    }
}