using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace API.ControllerBase
{
    /// <summary>
    ///      Teapot for testing
    /// </summary>
    /// <seealso cref="System.Web.Http.IHttpActionResult" />
    public class Teapot : IHttpActionResult
    {
        #region Methods

        /// <summary>
#pragma warning disable 1584,1711,1572,1581,1580
        ///      Creates an <see cref="System.Net.Http.HttpResponseMessage{T}" /> asynchronously.
#pragma warning restore 1584,1711,1572,1581,1580
        /// </summary>
        /// <param name="cancellationToken">The token to monitor for cancellation requests.</param>
        /// <returns>
        ///      A task that, when completed, contains the <see
#pragma warning disable 1584,1711,1572,1581,1580
        ///      cref="System.Net.Http.HttpResponseMessage{T}" />.
#pragma warning restore 1584,1711,1572,1581,1580
        /// </returns>
        public virtual Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            HttpResponseMessage res = new HttpResponseMessage((HttpStatusCode) 418) {ReasonPhrase = "I'm a teapot"};
            return Task.FromResult(res);
        }

        #endregion Methods
    }
}