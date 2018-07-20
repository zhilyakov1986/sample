using System.Collections.Generic;
using System.Web.Http.Controllers;
using System.Web.Http.Routing;

namespace API
{
    /// <summary>
    ///     This route provider lets us define routes on the base controller, while
    ///     using route prefixes on the derived controllers.
    ///     Makes using the base controller with attribute routing possible.
    ///     We want attribute-based routing (instead of just convention-based) to make
    ///     URL versioning easier.
    /// </summary>
    public class CustomDirectRouteProvider : DefaultDirectRouteProvider
    {
        protected override IReadOnlyList<IDirectRouteFactory>
            GetActionRouteFactories(HttpActionDescriptor actionDescriptor)
        {
            return actionDescriptor.GetCustomAttributes<IDirectRouteFactory>
                (true);
        }
    }
}