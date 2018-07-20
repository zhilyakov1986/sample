using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(NoteMetaData))]
    public partial class Note
    {
        internal sealed class NoteMetaData
        {
            private NoteMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<Customer> Customers { get; set; } // Many to many mapping
        }
    }
}
