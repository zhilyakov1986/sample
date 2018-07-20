using FluentValidation;
using Model;
using Service.Utilities;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using Service.Utilities.Validators;

namespace Service.Goods
{
    public class GoodService : BaseService, IGoodService
    {
        private readonly IValidator<Good> _goodValidator;
        public  GoodService (IPrimaryContext context)
            : base(context)
        {
            _goodValidator = new GoodsValidator(context);
        }


        public Document CreateDocument(int goodId, string fileName, byte[] docBytes, int uploadedBy)
        {
            Document doc = CreateDocument<Good>(goodId, fileName, docBytes, uploadedBy, new DocumentValidator());
            return doc;
        }

        public void DeleteDocument(int goodId, int docId)
        {
            DeleteDocument<Good>(goodId, docId);
        }

        IQueryable<Document> IGoodService.GetGoodDocuments(int goodId)
        {
            return Context.Goods
               .Where(c => c.Id == goodId)
               .SelectMany(c => c.Documents)
               .Include(d => d.User);
        }

        public Document GetDocument(int goodId, int documentID)
        {
            return Context.Goods
                               .Where(c => c.Id == goodId)
                               .SelectMany(c => c.Documents)
                               .Where(d => d.Id == documentID).FirstOrDefault();
        }

        public byte[] GetDocumentBytes(int goodId, int documentID)
        {
            Document document = GetDocument(goodId, documentID);

            if (document != null)
            {
                try
                {
                    var absolutePath = DocHelper.PrependDocsPath(document.FilePath);
                    return File.ReadAllBytes(absolutePath);
                }
                catch
                {
                    return null;
                }
            }

            return null;
        }

        public byte[] UpdateGeneric(object data)
        {
            return UpdateVersionable<Good>(data);
        }
    }
}
