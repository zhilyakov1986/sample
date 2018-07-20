using System;
using System.Net.Http;
using System.Web.Http;
using API.Jwt;
using FluentValidation;
using Microsoft.Owin;

namespace API.ControllerBase
{
    /// <summary>
    ///     This class in intended for extending the ApiController class.
    ///     You can use it to make retreiving custom fields from the JWT, or otherwise
    ///     set in the OWIN context, to make them more accessible in main controllers.
    /// </summary>
    public static class ApiControllerExtensions
    {
        /// <summary>
        ///     Abstracting static OWIN methods so we can test.
        ///     This factory will by default provide an internal class
        ///     that uses the request to retrieve the OWIN context.
        ///     The static factory method can be overridden in test
        ///     to produce a mock of IOwinResolver.
        /// </summary>
        public static Func<ApiController, IOwinResolver> OwinResovlerFactory =
            controller => new OwinResolver(controller);

        /// <summary>
        /// The actual extension method to use when retrieving context.
        /// </summary>
        /// <param name="controller"></param>
        /// <returns>Returns an IOwinResolver which can be used to retrieve OWIN context.</returns>
        public static IOwinResolver GetOwinResolver(this ApiController controller)
        {
            return OwinResovlerFactory(controller);
        }

        /// <summary>
        ///     Extension to retrieve custom fields from OWIN context.
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="key"></param>
        /// <returns>Returns a string value from the OWIN context that was associated with the key.</returns>
        public static string GetContextField(this ApiController controller, string key)
        {
            var ctx = controller.GetOwinResolver().GetOwinContext();
            return ctx?.Get<string>(key);
        }

        /// <summary>
        ///     Gets UserId from context (which pulled from Jwt).
        ///     This is not a guaranteed key.
        /// </summary>
        /// <param name="controller"></param>
        /// <returns></returns>
        public static int GetUserId(this ApiController controller)
        {
            int userId;
            int.TryParse(controller.GetContextField(OwinKeys.UserId), out userId);
            return userId;
        }

        /// <summary>
        ///     Gets AuthUserId from context (which pulled from Jwt).
        /// </summary>
        /// <param name="controller"></param>
        /// <returns>Returns a string of the UserId.</returns>
        public static string GetAuthUserId(this ApiController controller)
        {
            return controller.GetContextField(OwinKeys.AuthUserId);
        }

        /// <summary>
        ///     Gets Username from context (which pulled from Jwt).
        /// </summary>
        /// <param name="controller"></param>
        /// <returns>Returns the Username from the OWIN context.</returns>
        public static string GetUsername(this ApiController controller)
        {
            return controller.GetContextField(OwinKeys.AuthUsername);
        }

        /// <summary>
        ///     Gets AccessLevelId from context (which pulled from Jwt).
        /// </summary>
        /// <param name="controller"></param>
        /// <returns></returns>
        public static int GetAccessLevelId(this ApiController controller)
        {
            int id;
            int.TryParse(controller.GetContextField(OwinKeys.AccessLevelId), out id);
            return id;
        }

        /// <summary>
        ///     Adds the validation errors to ModelState, after manual catch.
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="vex"></param>
        public static void AddErrorsToModelState(this ApiController controller, ValidationException vex)
        {
            controller.ModelState.AddModelError(vex.Source, vex.Message);
        }
    }

    public interface IOwinResolver
    {
        IOwinContext GetOwinContext();
    }

    internal class OwinResolver : IOwinResolver
    {
        private readonly ApiController _controller;

        public OwinResolver(ApiController c)
        {
            _controller = c;
        }

        public IOwinContext GetOwinContext()
        {
            return _controller.Request.GetOwinContext();
        }
    }
}