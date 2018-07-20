using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Model
{
    [MetadataType(typeof(AddressMetaData))]
    public partial class Address
    {
        internal sealed class AddressMetaData
        {
            private AddressMetaData()
            {
            }
            [JsonIgnore]
            public ICollection<CustomerAddress> CustomerAddresses { get; set; } // Many to many mapping

            [JsonIgnore]
            public ICollection<User> Users { get; set; } // Users.FK_Users_Addresses

            [JsonIgnore]
            public ICollection<CustomerLocation> CustomerLocations { get; set; }

            [JsonIgnore]
            public ICollection<Contact> Contacts { get; set; } // CustomerContacts.FK_CustomerContacts_Addresses
        }
    }
}
