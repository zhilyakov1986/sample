using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace Model
{
    [MetadataType(typeof(DocumentMetaData))]
    public partial class Document
    {
        internal sealed class DocumentMetaData
        {
            private DocumentMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<User> Users { get; set; } // Many to many mapping

            [JsonIgnore]
            public ICollection<Customer> Customers { get; set; } // Many to many mapping
        }
    }
}