using Model;
using System.Collections.Generic;
using System.Linq;


namespace Service.Goods
{
    public interface IGoodService
    {
        Document CreateDocument(int goodId, string fileName, byte[] docBytes, int uploadedBy);
        void DeleteDocument(int goodId, int docId);
        IQueryable<Document> GetGoodDocuments(int goodId);
        Document GetDocument(int goodId, int documentID);
        byte[] GetDocumentBytes(int goodId, int documentID);
        byte[] UpdateGeneric(object data);
    }
}
