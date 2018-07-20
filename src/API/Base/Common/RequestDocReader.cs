using System.Net.Http;
using System.Threading.Tasks;
using API.ControllerBase;

namespace API.Common
{
    public class PostedDoc
    {
        public byte[] DocBytes { get; set; }
        public string FileName { get; set; }
    }

    public interface IRequestDocReader
    {
        Task<PostedDoc> GetDocBytesFromRequest(ApiControllerBase controller);
    }

    public class RequestDocReader : IRequestDocReader
    {
        public async Task<PostedDoc> GetDocBytesFromRequest(ApiControllerBase controller)
        {
            PostedDoc doc = new PostedDoc { DocBytes = null };
            var provider = new MultipartMemoryStreamProvider();

            await controller.Request.Content.ReadAsMultipartAsync(provider);
            if (provider.Contents.Count > 0)
            {
                var file = provider.Contents[0];
                string name = file.Headers.ContentDisposition.FileName?.Trim('\"');
                doc.DocBytes = await file.ReadAsByteArrayAsync();
                doc.FileName = name;
            }
            return doc;
        }
    }
}