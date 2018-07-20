using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Model
{
    [MetadataType(typeof(PhoneTypeMetaData))]
    public partial class PhoneType
    {
        internal sealed class PhoneTypeMetaData
        {
            private PhoneTypeMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<ContactPhone> ContactPhones { get; set; } // ContactPhones.FK_ContactPhones_PhoneTypes
            
            [JsonIgnore]
            public ICollection<UserPhone> UserPhones { get; set; } // UserPhones.FK_UserPhones_PhoneTypes

            [JsonIgnore]
            public ICollection<CustomerPhone> CustomerPhones { get; set; } // CustomerPhones.FK_CustomerPhones_PhoneTypes
        }
    }
}