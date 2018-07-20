using FluentValidation;
using Model;
using Service.Utilities;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using Service.Utilities.Validators;
using Service.CustomerLocations.Address;
using Service.Common.Address;
using System.Data.Linq;
using System.Runtime.Remoting.Contexts;

namespace Service.CustomerLocations
{
    public class CustomerLocationService : BaseService, ICustomerLocationService
    {
        private readonly IValidator<CustomerLocation> _customerLocationValidator;
        public CustomerLocationService(IPrimaryContext context)
            : base(context)
        {
            _customerLocationValidator = new CustomerLocationValidator(context);
        }

       public CustomerLocation Reload(int custLocId)
        {
            return Context.CustomerLocations
                .Include(cl => cl.Address)
                .Include(cl => cl.Customer)
                .Include(cl => cl.Archived)
                .Include(cl => cl.ServiceArea)
                .AsNoTracking()
                .SingleOrDefault(cl => cl.Id == custLocId);
        }

        public IQueryable<CustomerLocation> GetLocationForCustomer(int customerId)
        {
            return Context.CustomerLocations
                .Where(cl => cl.CustomerId == customerId);
               
        }
     

        #region "Documents"
        /// <summary>
        /// Creates a new document under this CustomerLocaion
        /// </summary>
        /// <param name="customerLocationId"></param>
        /// <param name="fileName"></param>
        /// <param name="docBytes"></param>
        /// <param name="uploadedBy"></param>
        /// <returns></returns>
        public Document CreateDocument(int customerLocationId, string fileName, byte[] docBytes, int uploadedBy)
        {
            Document doc = CreateDocument<CustomerLocation>(customerLocationId, fileName, docBytes, uploadedBy, new DocumentValidator());
            return doc;
        }

        /// <summary>
        /// Deletes Document
        /// </summary>
        /// <param name="customerLocationId"></param>
        /// <param name="docId"></param>
        public void DeleteDocument(int customerLocationId, int docId)
        {
            DeleteDocument<CustomerLocation>(customerLocationId, docId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="customerLocationId"></param>
        /// <param name="documentID"></param>
        /// <returns></returns>
        public Document GetDocument(int customerLocationId, int documentID)
        {
            return Context.CustomerLocations
                              .Where(c => c.Id == customerLocationId)
                              .SelectMany(c => c.Documents)
                              .Where(d => d.Id == documentID).FirstOrDefault();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="customerLocationId"></param>
        /// <param name="documentID"></param>
        /// <returns></returns>
        public byte[] GetDocumentBytes(int customerLocationId, int documentID)
        {
            Document document = GetDocument(customerLocationId, documentID);

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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="customerLocationId"></param>
        /// <returns></returns>
        public IQueryable<Document> GetCustomerLocationDocuments(int customerLocationId)
        {
            return Context.CustomerLocations
               .Where(c => c.Id == customerLocationId)
               .SelectMany(c => c.Documents)
               .Include(d => d.User);
        }
        #endregion
        #region "User-like addresses"

        /// <summary>
        ///     Creates new Address and associates it to CustomerLocation
        /// </summary>
        /// <param name="custLocId"></param>
        /// <param name="address"></param>
        /// <returns></returns>
        public CreateAddressResult CreateAddress( int custLocId, Model.Address address)
        {
            return base.CreateAddress<CustomerLocation>(custLocId, address);
        }

        /// <summary>
        ///     Deletes an address asociated with customer location
        /// </summary>
        /// <param name="custLocId"></param>
        public void DeleteAddress(int custLocId)
        {
            base.DeleteAddress<CustomerLocation>(custLocId);
        }

        /// <summary>
        ///     Updates an Address of a User.
        /// </summary>
        public new void UpdateAddress(Model.Address address)
        {
            base.UpdateAddress(address);
        }

        #endregion
        #region "Addresses"

        ///// <summary>
        ///// Gets All Addresses for a CustomerLocation
        ///// </summary>
        ///// <param name="customerLocationId"></param>
        ///// <returns></returns>
        //public IQueryable<CustomerLocationAddress> GetCustomerLocationAddresses(int customerLocationId)
        //{
        //    return Context.CustomerLocations
        //        .Where(cl => cl.Id == customerLocationId)
        //        .SelectMany(cl => cl.CustomerLocationAddresses)
        //        .Include(ca => ca.Address)
        //        .AsQueryable();
        //}
        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="customerLocationId"></param>
        ///// <param name="claCol"></param>
        //public void MergeAddresses(int customerLocationId, CustomerLocationAddressCollection claCol)
        //{
        //    ThrowIfNull(claCol);
        //    claCol.CustomerLocationAddresses = claCol.CustomerLocationAddresses ?? new List<CustomerLocationAddress>();
        //    ValidateAndThrow(claCol, new CustomerLocationAddressCollectionValidator());
        //    // removes
        //    var claColCustomerLocAddresses = claCol.CustomerLocationAddresses as
        //        CustomerLocationAddress[] ?? claCol.CustomerLocationAddresses.ToArray();
        //    var idsToKeep = claColCustomerLocAddresses.Select(cla => cla.Address.Id).ToArray();
        //    var claToRemove = Context.CustomerLocationAddresses.Where(cl => cl.CustomerLocationId == customerLocationId && !idsToKeep.Contains(cl.AddressId)).ToArray();
        //    var adToRemove = claToRemove.Select(cla => Spoof<Model.Address>
        //        (cla.AddressId)).ToList();
        //    adToRemove.ForEach(a => Context.Addresses.Attach(a));
        //    Context.CustomerLocationAddresses.RemoveRange(claToRemove);
        //    Context.Addresses.RemoveRange(adToRemove);

        //    // add and update
        //    foreach (var clAddr in claColCustomerLocAddresses)
        //    {
        //        if (clAddr.Address.Id == 0)
        //        {
        //            clAddr.CustomerLocationId = customerLocationId; // to ask why?
        //            Context.Addresses.Add(clAddr.Address);
        //            Context.CustomerLocationAddresses.Add(clAddr);
        //        }
        //        else
        //        {
        //            clAddr.CustomerLocationId = customerLocationId; // to ask why?
        //            clAddr.AddressId = clAddr.Address.Id;
        //            Context.Addresses.Attach(clAddr.Address);
        //            Context.SetEntityState(clAddr.Address, EntityState.Modified);
        //            Context.CustomerLocationAddresses.Attach(clAddr);
        //            Context.SetEntityState(clAddr, EntityState.Modified);
        //        }
        //    }
        //    Context.SaveChanges();
        //}

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="customerLocationId"></param>
        ///// <param name="address"></param>
        ///// <returns></returns>
        //public int SaveAddress(int customerLocationId, CustomerLocationAddress address)
        //{
        //    ThrowIfNull(address);
        //    ThrowIfNull(customerLocationId);
        //    var customerLocation = Context.CustomerLocations
        //        .Where(cl => cl.Id == customerLocationId).First();
        //    ThrowIfNull(customerLocation);
        //    if (address.AddressId == 0)
        //    {
        //        Context.CustomerLocationAddresses.Add(new CustomerLocationAddress() { Address = address.Address, CustomerLocation = customerLocation, IsPrimary = address.IsPrimary });
        //    }
        //    else
        //    {
        //        Context.Addresses.Attach(address.Address);
        //        Context.SetEntityState(address.Address, EntityState.Modified);
        //        Context.CustomerLocationAddresses.Attach(address);
        //        Context.SetEntityState(address, EntityState.Modified);
        //    }

        //    Context.SaveChanges();

        //    var customerLocationAddresses = Context.CustomerLocations
        //        .Where(cl => cl.Id == customerLocationId)
        //        .SelectMany(c => c.CustomerLocationAddresses)
        //        .ToArray();
        //    EnsureOneAddressIsPrimary(customerLocationAddresses, address.IsPrimary ? address.Address.Id : (int?)null);

        //    return address.Address.Id;
        //}

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="addresses"></param>
        ///// <param name="addressId"></param>
        //private void EnsureOneAddressIsPrimary<T>(T[] addresses, int? addressId = null) where T : Model.Partials.IEntityAddress
        //{
        //    if (!addresses.Any() || addresses.Count(ca => ca.IsPrimary) == 1)
        //    {
        //        return;
        //    }

        //    if (!addressId.HasValue)
        //    {
        //        addressId = addresses.OrderBy(ca => ca.AddressId).First().AddressId;
        //    }

        //    foreach (var ca in addresses)
        //    {
        //        ca.IsPrimary = ca.AddressId == addressId.Value;
        //    }

        //    Context.SaveChanges();
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="customerLocationId"></param>
        /// <param name="addressId"></param>
        //public void DeleteAddress(int customerLocationId, int addressId)
        //{
        //    ThrowIfNull(addressId);
        //    ThrowIfNull(customerLocationId);
        //    var claToRemove = Context.CustomerLocationAddresses.Where(cl => cl.CustomerLocationId == customerLocationId && cl.AddressId == addressId).ToArray();
        //    Context.CustomerLocationAddresses.RemoveRange(claToRemove);

        //    Model.Address obj = new Model.Address { Id = addressId };
        //    Context.Addresses.Attach(obj);
        //    Context.Addresses.Remove(obj);

        //    Context.SaveChanges();

        //    var customerLocationAddresses = Context.CustomerLocations
        //        .Where(c => c.Id == customerLocationId)
        //        .SelectMany(c => c.CustomerLocationAddresses)
        //        .ToArray();
        //    EnsureOneAddressIsPrimary(customerLocationAddresses);
        //}
        

        #endregion

    }
}
