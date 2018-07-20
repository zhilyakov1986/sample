using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Model
{
    [MetadataType(typeof(ContactStatusMetaData))]
    public partial class ContactStatus
    {
        internal sealed class ContactStatusMetaData
        {
            private ContactStatusMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<Contact> Contacts { get; set; } // CustomerContacts.FK_CustomerContacts_ContactStatuses
        }
    }
}
