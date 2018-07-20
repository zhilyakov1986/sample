using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Model
{
    [MetadataType(typeof(ContactPhoneMetaData))]
    public partial class ContactPhone : IHasPhoneNumber
    {
        internal sealed class ContactPhoneMetaData
        {
            private ContactPhoneMetaData()
            { }

            [JsonIgnore]
            public Contact Contact { get; set; } // FK_ContactPhones_CustomerContacts
        }
    }
}
