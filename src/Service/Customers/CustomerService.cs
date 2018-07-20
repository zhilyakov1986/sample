using FluentValidation;
using Model;
using Service.Utilities;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using Service.Common.Phone;
using Service.Customers.Address;
using Service.Customers.Contacts;
using Service.Customers.Phone;
using Service.Utilities.Validators;

namespace Service.Customers
{
    public class CustomerService : BaseService, ICustomerService
    {
        private readonly IValidator<Customer> _customerValidator;

        public CustomerService(IPrimaryContext context)
            : base(context)
        {
            _customerValidator = new CustomerValidator();
        }


        /// <summary>
        ///     Gets simplified Customers for filters.
        /// </summary>
        /// <returns>Returns an IEnumerable of Simplified Customers.</returns>
        public IEnumerable<Simplified<Customer>> GetSimplifiedCustomers()
        {
            return Simplified<Customer>.FromEnum(Context.Customers.AsEnumerable(), c => c.Name);
        }

        /// <summary>
        ///     Merges CustomerPhones.
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="phones"></param>
        public void MergeCustomerPhones(int customerId, PhoneCollection<CustomerPhone> phones)
        {
            ThrowIfNull(phones);
            ValidateAndThrow(phones, new CustomerPhoneCollectionValidator()); //  validate phones that will persist

            if (phones.Phones != null)
            {
                foreach (var p in phones.Phones)
                {
                    p.PhoneType = null; // clean out PhoneType if present for adds
                    p.CustomerId = customerId; // in case it wasn't set...
                }
            }

            var existing = Context.CustomerPhones.Where(cp => cp.CustomerId == customerId);
            Context.Merge<CustomerPhone>()
                .SetExisting(existing)
                .SetUpdates(phones.Phones)
                .MergeBy((e, u) => e.Phone == u.Phone && e.Extension == u.Extension)
                .MapUpdatesBy((e, u) =>
                {
                    e.IsPrimary = u.IsPrimary;
                    e.PhoneTypeId = u.PhoneTypeId;
                })
                .Merge();
            Context.SaveChanges();
        }

        /// <summary>
        ///     Reloads a Customer from db.
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns>Returns the Customer.</returns>
        public Customer ReloadCustomer(int customerId)
        {
            return Context.Customers
                .Include(c => c.CustomerSource)
                .Include(c => c.CustomerStatus)
                .Include(c => c.CustomerPhones)
                .Include(c => c.CustomerAddresses)
                .AsNoTracking()
                .SingleOrDefault(c => c.Id == customerId);
        }

        /// <summary>
        ///     Updates a Customer.
        /// </summary>
        /// <param name="customer"></param>
        /// <returns>Returns the rowversion of the customer.</returns>
        public byte[] UpdateCustomer(Customer customer)
        {
            ThrowIfNull(customer);

            // clearing associations if present
            customer.CustomerStatus = null;
            customer.CustomerSource = null;
            customer.CustomerAddresses = null;
            customer.CustomerPhones = null;
            customer.Documents = null;

            // update
            ValidateAndThrow(customer, _customerValidator);
            Context.Customers.Attach(customer);
            Context.SetEntityState(customer, EntityState.Modified);
            Context.SaveChanges();
            return customer.Version;
        }

        /// <summary>
        /// Updates a customer with only the fields passed in
        /// </summary>
        /// <param name="data">The JSON object </param>
        /// <returns></returns>
        public byte[] UpdateGeneric(object data)
        {
            return UpdateVersionable<Customer>(data);
        }

        /// <summary>
        ///     Deletes a customer. This does not yet check for FKs.
        ///     If we want to really wipe, need to clear all phones, notes, docs, etc.
        /// </summary>
        /// <param name="customerId"></param>
        public void DeleteCustomer(int customerId)
        {
            var customer = GetCustomerForDelete(customerId);
            ThrowIfNull(customer);
            if (customer.CustomerAddresses.Any())
            {
                var addrIds = customer.CustomerAddresses.Select(ca => ca.AddressId).ToList();
                Context.CustomerAddresses.RemoveRange(customer.CustomerAddresses);
                addrIds.ForEach(a =>
                {
                    var addr = Spoof<Model.Address>(a);
                    Context.Addresses.Attach(addr);
                    Context.Addresses.Remove(addr);
                });
            }
            foreach (var cc in customer.Contacts)
            {
                RemoveContactAddress(cc);
                Context.ContactPhones.RemoveRange(cc.ContactPhones);
            }
            Context.Contacts.RemoveRange(customer.Contacts);
            Context.CustomerPhones.RemoveRange(customer.CustomerPhones);
            Context.Notes.RemoveRange(customer.Notes);
            Context.Documents.RemoveRange(customer.Documents);
            Context.Customers.Remove(customer);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Gets a customer by id.
        /// </summary>
        /// <param name="customerId"></param>
        /// <returns>Returns a Customer.</returns>
        public Customer GetCustomerById(int customerId)
        {
            return Context.Customers
                .Include(c => c.CustomerSource)
                .Include(c => c.CustomerStatus)
                .Include(c => c.CustomerPhones)
                .Include(c => c.CustomerAddresses)
                .Include(c => c.Notes)
                .Include(c => c.CustomerAddresses.Select(ca => ca.Address))
                .SingleOrDefault(c => c.Id == customerId);
        }

        public Customer GetCustomerDetail(int customerId)
        {
            var customer = Context.Customers
                .Include(c => c.CustomerSource)
                .Include(c => c.CustomerStatus)
                .Include(c => c.CustomerPhones)
                .Include(c => c.CustomerAddresses)
                .Include(c => c.Contacts)
                .Include(c => c.Notes)
                .Include(c => c.CustomerAddresses.Select(ca => ca.Address))
                .Include(c => c.Documents)
                .SingleOrDefault(c => c.Id == customerId);

            if (customer?.Notes?.Count > 3)
            {
                customer.Notes = customer.Notes.OrderBy(n => n.Title).Take(3).ToArray();
            }

            if (customer?.Contacts?.Count > 3)
            {
                customer.Contacts = customer.Contacts.OrderBy(c => c.LastName).ThenBy(c => c.FirstName).Take(3).ToArray();
            }

            if (customer?.Documents?.Count > 3)
            {
                customer.Documents = customer.Documents.OrderByDescending(d => d.DateUpload).Take(3).ToArray();
            }

            if (customer?.CustomerAddresses?.Count > 3)
            {
                customer.Addresses = customer.CustomerAddresses.OrderByDescending(ca => ca.IsPrimary).Select(a => a.Address).Take(3).ToArray();
            }
            else
            {
                customer.Addresses = customer.CustomerAddresses.OrderByDescending(ca => ca.IsPrimary).Select(a => a.Address).ToArray();
            }

            return customer;
        }

        /// <summary>
        ///     Gets all customers.
        /// </summary>
        /// <returns>Returns an IQueryable of Customers.</returns>
        public IQueryable<Customer> GetCustomers()
        {
            // TODO: ideally, we'd only return primary addr here...
            return Context.Customers
                .Include(c => c.CustomerSource)
                .Include(c => c.CustomerStatus)
                .Include(c => c.CustomerPhones)
                .Include(c => c.CustomerAddresses)
                .Include(c => c.CustomerAddresses.Select(ca => ca.Address));
        }

        private Customer GetCustomerForDelete(int customerId)
        {
            return Context.Customers
                .Include(c => c.CustomerAddresses)
                .Include(c => c.Contacts)
                .Include(c => c.CustomerPhones)
                .Include(c => c.Documents)
                .Include(c => c.Notes)
                .SingleOrDefault(c => c.Id == customerId);
        }

        #region "Contacts"

        /// <summary>
        ///     Creates a Contact under a Customer.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="contact"></param>
        /// <returns>Returns the id of the new Contact.</returns>
        public int CreateContact(int custId, Contact contact)
        {
            ThrowIfNull(contact);
            contact.ContactStatus = null; // just in case
            contact.Address = null;
            ValidateAndThrow(contact, new ContactValidator());
            var customer = Spoof<Customer>(custId);
            Context.Customers.Attach(customer);
            Context.Contacts.Add(contact);
            customer.Contacts.Add(contact);
            Context.SaveChanges();
            return contact.Id;
        }

        /// <summary>
        ///     Creates an Address for a Contact.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="contactId"></param>
        /// <param name="addr"></param>
        /// <returns>Returns the id of the new Address.</returns>
        public int CreateContactAddress(int custId, int contactId, Model.Address addr)
        {
            ThrowIfNull(addr);
            ValidateAndThrow(addr, new AddressValidator());
            var contact = Spoof<Contact>(contactId);
            Context.Contacts.Attach(contact);
            Context.Addresses.Add(addr);
            contact.Address = addr;
            Context.SaveChanges();
            return addr.Id;
        }

        /// <summary>
        ///     Deletes a Contact.
        ///     Allows you to pass in a test transaction.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="contactId"></param>
        public void DeleteContact(int custId, int contactId)
        {
            var contact = Context.Contacts
                .Include(cc => cc.ContactPhones)
                .SingleOrDefault(cc => cc.Id == contactId);
            ThrowIfNull(contact);

            // delete phones
            // ReSharper disable once PossibleNullReferenceException
            Context.ContactPhones.RemoveRange(contact.ContactPhones);

            // delete address
            RemoveContactAddress(contact);

            // delete the contact from customer and context
            var customer = Spoof<Customer>(custId);
            customer.Contacts = new List<Contact> { contact };
            Context.Customers.Attach(customer);
            customer.Contacts.Remove(contact);
            Context.Contacts.Remove(contact);

            // save
            Context.SaveChanges();
        }

        /// <summary>
        ///     Deletes a Contact's Address.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="contactId"></param>
        /// <param name="addrId"></param>
        public void DeleteContactAddress(int custId, int contactId, int addrId)
        {
            // update contact
            var contact = new Contact { Id = contactId, AddressId = addrId };
            Context.Contacts.Attach(contact);
            contact.AddressId = null;

            // remove address
            var addr = Spoof<Model.Address>(addrId);
            Context.Addresses.Attach(addr);
            Context.Addresses.Remove(addr);

            Context.SaveChanges();
        }

        /// <summary>
        ///     Gets a Contact by Id.
        /// </summary>
        /// <param name="contactId"></param>
        /// <returns>Returns the CustomerContact.</returns>
        public Contact GetContactById(int contactId)
        {
            return Context.Contacts
               .Include(cc => cc.Address)
               .Include(cc => cc.ContactStatus)
               .Include(cc => cc.ContactPhones)
               .SingleOrDefault(cc => cc.Id == contactId);
        }

        /// <summary>
        ///     Gets all Contact Statuses.
        /// </summary>
        /// <returns>Returns an IEnumerable of ContactStatus.</returns>
        public IEnumerable<ContactStatus> GetContactStatuses()
        {
            return GetAll<ContactStatus>();
        }

        /// <summary>
        ///     Gets Contacts for a Customer.
        /// </summary>
        /// <param name="custId"></param>
        /// <returns>Returns an IQueryable of Contacts.</returns>
        public IQueryable<Contact> GetCustomerContacts(int custId)
        {
            return Context.Customers
                .Where(c => c.Id == custId)
                .SelectMany(c => c.Contacts)
                .Include(c => c.Address)
                .Include(c => c.ContactPhones)
                .Include(c => c.ContactStatus);
        }



        /// <summary>
        ///     Merges Contact's Phones.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="contactId"></param>
        /// <param name="phones"></param>
        public void MergeContactPhones(int custId, int contactId, PhoneCollection<ContactPhone> phones)
        {
            ThrowIfNull(phones);
            ValidateAndThrow(phones, new ContactPhoneCollectionValidator());
            if (phones.Phones != null)
            {
                foreach (var p in phones.Phones)
                {
                    p.PhoneType = null;
                    p.ContactId = contactId;
                }
            }

            var existing = Context.ContactPhones.Where(cp => cp.ContactId == contactId);
            Context.Merge<ContactPhone>()
                .SetExisting(existing)
                .SetUpdates(phones.Phones)
                .MergeBy((e, u) => e.Phone == u.Phone && e.Extension == u.Extension)
                .MapUpdatesBy((e, u) =>
                {
                    e.IsPrimary = u.IsPrimary;
                    e.PhoneTypeId = u.PhoneTypeId;
                })
                .Merge();
            Context.SaveChanges();
        }


        /// <summary>
        ///     Updates a Customer Contact.
        /// </summary>
        /// <param name="contact"></param>
        public void UpdateContact(Contact contact)
        {
            ThrowIfNull(contact);

            // clearing associations if present
            contact.ContactStatus = null;
            contact.ContactPhones = null;
            contact.Address = null;

            // update
            ValidateAndThrow(contact, new ContactValidator());
            Context.Contacts.Attach(contact);
            Context.SetEntityState(contact, EntityState.Modified);
            Context.SaveChanges();
        }

        /// <summary>
        ///     Updates the Address of a Contact.
        ///     Needs custId to update search index.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="address"></param>
        public void UpdateContactAddress(int custId, Model.Address address)
        {
            ThrowIfNull(address);
            ValidateAndThrow(address, new AddressValidator());
            Context.Addresses.Attach(address);
            Context.SetEntityState(address, EntityState.Modified);
            Context.SaveChanges();
        }

        private void RemoveContactAddress(Contact cc)
        {
            if (cc.AddressId == null) return;
            var addr = Spoof<Model.Address>(cc.AddressId.Value);
            cc.AddressId = null;
            Context.Addresses.Attach(addr);
            Context.Addresses.Remove(addr);
        }

        #endregion

        #region "Documents"

        /// <summary>
        ///     Creates a new Document under this Customer.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="fileName"></param>
        /// <param name="docBytes"></param>
        /// <param name="uploadedBy"></param>
        /// <returns>Returns the Document.</returns>
        public Document CreateDocument(int custId, string fileName, byte[] docBytes, int uploadedBy)
        {
            Document doc = CreateDocument<Customer>(custId, fileName, docBytes, uploadedBy, new DocumentValidator());
            return doc;
        }

        /// <summary>
        ///     Deletes a Document from a Customer and disk.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="docId"></param>
        public void DeleteDocument(int custId, int docId)
        {
            DeleteDocument<Customer>(custId, docId);
        }

        /// <summary>
        ///     Gets all Documents for a Customer.
        /// </summary>
        /// <param name="custId"></param>
        /// <returns>Returns an IQueryable of Documents.</returns>
        public IQueryable<Document> GetCustomerDocuments(int custId)
        {
            return Context.Customers
                .Where(c => c.Id == custId)
                .SelectMany(c => c.Documents)
                .Include(d => d.User);
        }


        public byte[] GetDocumentBytes(int custId, int documentID)
        {
            Document document = GetDocument(custId, documentID);

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

        public Document GetDocument(int custId, int documentID)
        {
            return Context.Customers
                                .Where(c => c.Id == custId)
                                .SelectMany(c => c.Documents)
                                .Where(d => d.Id == documentID).FirstOrDefault();

        }


        #endregion

        #region "Notes"

        /// <summary>
        ///     Creates a Note under this Customer.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="note"></param>
        /// <returns>Returns the Id of the new Note.</returns>
        public int CreateNote(int custId, Note note)
        {
            ThrowIfNull(note);
            ValidateAndThrow(note, new NoteValidator());
            var customer = Spoof<Customer>(custId);
            Context.Customers.Attach(customer);
            Context.Notes.Add(note);
            customer.Notes.Add(note);
            Context.SaveChanges();
            return note.Id;
        }

        /// <summary>
        ///     Deletes a Note.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="noteId"></param>
        public void DeleteNote(int custId, int noteId)
        {
            var note = Spoof<Note>(noteId);
            var cust = Spoof<Customer>(custId);
            cust.Notes = new List<Note> { note };

            Context.Notes.Attach(note);
            Context.Customers.Attach(cust);

            cust.Notes.Remove(note);
            Context.Notes.Remove(note);

            Context.SaveChanges();
        }

        /// <summary>
        ///     Gets all Notes for a Customer.
        /// </summary>
        /// <param name="custId"></param>
        /// <returns>Returns an IQueryable of Notes.</returns>
        public IQueryable<Note> GetCustomerNotes(int custId)
        {
            return Context.Customers
                .Where(c => c.Id == custId)
                .SelectMany(c => c.Notes);
        }


        /// <summary>
        ///     Updates a Note.
        /// </summary>
        /// <param name="custId"></param>
        /// <param name="note"></param>
        public void UpdateNote(int custId, Note note)
        {
            base.UpdateNote(note);
        }

        #endregion

        #region "Addresses"

        /// <summary>
        ///     Gets all Addresses for a Customer.
        /// </summary>
        /// <param name="custId"></param>
        /// <returns>Returns an IQueryable of Addresses.</returns>
        public IQueryable<CustomerAddress> GetCustomerAddresses(int custId)
        {
            return Context.Customers
                .Where(c => c.Id == custId)
                .SelectMany(c => c.CustomerAddresses)
                .Include(ca => ca.Address)
                .AsQueryable();
        }


        /// <summary>
        ///     Merges CustomerAddresses for a Customer.
        /// </summary>
        /// <param name="customerId"></param>
        /// <param name="caCol"></param>
        public void MergeAddresses(int customerId, CustomerAddressCollection caCol)
        {
            ThrowIfNull(caCol);
            caCol.CustomerAddresses = caCol.CustomerAddresses ?? new List<CustomerAddress>();
            ValidateAndThrow(caCol, new CustomerAddressCollectionValidator());

            // removes
            var caColCustomerAddresses = caCol.CustomerAddresses as CustomerAddress[] ?? caCol.CustomerAddresses.ToArray();
            var idsToKeep = caColCustomerAddresses.Select(ca => ca.Address.Id).ToArray();
            var caToRemove = Context.CustomerAddresses.Where(c => c.CustomerId == customerId && !idsToKeep.Contains(c.AddressId)).ToArray();
            var adToRemove = caToRemove.Select(ca => Spoof<Model.Address>(ca.AddressId)).ToList();
            adToRemove.ForEach(a => Context.Addresses.Attach(a));
            Context.CustomerAddresses.RemoveRange(caToRemove);
            Context.Addresses.RemoveRange(adToRemove);

            // add and update
            foreach (var cAddr in caColCustomerAddresses)
            {
                if (cAddr.Address.Id == 0)
                {
                    cAddr.CustomerId = customerId; // just in case
                    Context.Addresses.Add(cAddr.Address);
                    Context.CustomerAddresses.Add(cAddr);
                }
                else
                {
                    cAddr.CustomerId = customerId; // just in case
                    cAddr.AddressId = cAddr.Address.Id;
                    Context.Addresses.Attach(cAddr.Address);
                    Context.SetEntityState(cAddr.Address, EntityState.Modified);
                    Context.CustomerAddresses.Attach(cAddr);
                    Context.SetEntityState(cAddr, EntityState.Modified);
                }
            }

            Context.SaveChanges();
        }


        public int SaveAddress(int customerId, CustomerAddress address)
        {
            ThrowIfNull(address);
            ThrowIfNull(customerId);
            var customer = Context.Customers
                                .Where(c => c.Id == customerId).First();
            ThrowIfNull(customer);
            if (address.AddressId == 0)
            {
                Context.CustomerAddresses.Add(new CustomerAddress() { Address = address.Address, Customer = customer, IsPrimary = address.IsPrimary });
            }
            else
            {
                Context.Addresses.Attach(address.Address);
                Context.SetEntityState(address.Address, EntityState.Modified);
                Context.CustomerAddresses.Attach(address);
                Context.SetEntityState(address, EntityState.Modified);
            }

            Context.SaveChanges();

            var customerAddresses = Context.Customers
                .Where(c => c.Id == customerId)
                .SelectMany(c => c.CustomerAddresses)
                .ToArray();
            EnsureOneAddressIsPrimary(customerAddresses, address.IsPrimary ? address.Address.Id : (int?)null);

            return address.Address.Id;
        }

        private void EnsureOneAddressIsPrimary<T>(T[] addresses, int? addressId = null) where T : Model.Partials.IEntityAddress
        {
            if (!addresses.Any() || addresses.Count(ca => ca.IsPrimary) == 1)
            {
                return;
            }

            if (!addressId.HasValue)
            {
                addressId = addresses.OrderBy(ca => ca.AddressId).First().AddressId;
            }

            foreach (var ca in addresses)
            {
                ca.IsPrimary = ca.AddressId == addressId.Value;
            }

            Context.SaveChanges();
        }

        public void DeleteAddress(int customerId, int addressId)
        {
            ThrowIfNull(addressId);
            ThrowIfNull(customerId);
            var caToRemove = Context.CustomerAddresses.Where(c => c.CustomerId == customerId && c.AddressId == addressId).ToArray();
            Context.CustomerAddresses.RemoveRange(caToRemove);

            Model.Address obj = new Model.Address { Id = addressId };
            Context.Addresses.Attach(obj);
            Context.Addresses.Remove(obj);

            Context.SaveChanges();

            var customerAddresses = Context.Customers
                .Where(c => c.Id == customerId)
                .SelectMany(c => c.CustomerAddresses)
                .ToArray();
            EnsureOneAddressIsPrimary(customerAddresses);
        }


        #endregion

    }

}
