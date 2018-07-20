using Model;
using Service.Common.Address;
using System.Linq;



namespace Service.CustomerLocations
{
    public interface ICustomerLocationService
    {
        Document CreateDocument(int customerLocationId, string fileName, byte[] docBytes, int uploadedBy);
        void DeleteDocument(int customerLocationId, int docId);
        IQueryable<Document> GetCustomerLocationDocuments(int customerLocationId);
        Document GetDocument(int customerLocationId, int documentID);
        byte[] GetDocumentBytes(int customerLocationId, int documentID);

        IQueryable<CustomerLocation> GetLocationForCustomer(int customerId);
        CreateAddressResult CreateAddress(int custLocId, Model.Address address);
        void DeleteAddress(int custLocId);
        void UpdateAddress(Model.Address address);
        CustomerLocation Reload(int custLocId);

        
    } 
}
