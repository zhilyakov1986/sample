using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http.Filters;

namespace API.Attributes
{
    /// <summary>
    ///     This filter checks the request to see if gzip is accepted and we have a valid response to send.
    ///     If so, we gzip the response.
    ///     It is currently applied globally in the WebApiConfig.cs, so if this is a problem,
    ///     you can use the OverrideActionFiltersAttribute to get around it.
    /// </summary>
    public class CompressionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            bool skip = actionExecutedContext.ActionContext.ActionDescriptor
                .GetCustomAttributes<SkipCompressionAttribute>()
                .Any();
            if (!skip && actionExecutedContext.Response != null && actionExecutedContext.Exception == null)
            {
                var content = actionExecutedContext.Response.Content;
                var contentEncoding = actionExecutedContext.Request.Headers.AcceptEncoding;

                if (content != null && contentEncoding.Contains(new StringWithQualityHeaderValue("gzip")))
                {
                    // gzip
                    byte[] compressed;
                    using (var outStream = new MemoryStream())
                    {
                        using (var g = new GZipStream(outStream, CompressionMode.Compress))
                        using (var contentStream = new MemoryStream(content.ReadAsByteArrayAsync().Result))
                            contentStream.CopyTo(g);
                        compressed = outStream.ToArray();
                    }
                    actionExecutedContext.Response.Content = new ByteArrayContent(compressed);

                    // deal with headers
                    actionExecutedContext.Response.Content.Headers.Remove("Content-Type");
                    actionExecutedContext.Response.Content.Headers.Add("Content-Encoding", "gzip");
                    actionExecutedContext.Response.Content.Headers.Add("Content-Type", "application/json");
                }
            }
            base.OnActionExecuted(actionExecutedContext);
        }
    }
}
