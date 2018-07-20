using Model;
using System.Collections.Generic;
using System.Linq;
using Service.Common.Phone;
using Service.Customers.Address;
using Service.Customers.Sources;

namespace Service.Customers
{
    public interface ICustomerService
    {
        int CreateContact(int custId, Contact contact);

        int CreateContactAddress(int custId, int contactId, Model.Address addr);

        Document CreateDocument(int custId, string fileName, byte[] docBytes, int uploadedBy);

        int CreateNote(int custId, Note note);

        void DeleteContact(int custId, int contactId);

        void DeleteContactAddress(int custId, int contactId, int addrId);

        void DeleteCustomer(int customerId);

        void DeleteDocument(int custId, int docId);

        void DeleteNote(int custId, int noteId);

        Contact GetContactById(int contactId);

        IEnumerable<ContactStatus> GetContactStatuses();

        Customer GetCustomerById(int customerId);

        Customer GetCustomerDetail(int customerId);

        IQueryable<Contact> GetCustomerContacts(int custId);

        IQueryable<Document> GetCustomerDocuments(int custId);

        IQueryable<CustomerAddress> GetCustomerAddresses(int custId);

        IQueryable<Note> GetCustomerNotes(int custId);

        IQueryable<Customer> GetCustomers();

        IEnumerable<Simplified<Customer>> GetSimplifiedCustomers();

        void MergeAddresses(int customerId, CustomerAddressCollection caCol);

        int SaveAddress(int customerId, CustomerAddress address);

        void DeleteAddress(int customerId, int addressId);

        void MergeContactPhones(int custId, int contactId, PhoneCollection<ContactPhone> phones);

        void MergeCustomerPhones(int customerId, PhoneCollection<CustomerPhone> phones);

        Customer ReloadCustomer(int customerId);

        void UpdateContact(Contact contact);

        void UpdateContactAddress(int custId, Model.Address address);

        byte[] UpdateCustomer(Customer customer);

        byte[] UpdateGeneric(object data);

        void UpdateNote(int custId, Note note);

        Document GetDocument(int custId, int documentID);
       byte[] GetDocumentBytes(int custId, int documentID);
  }
}
