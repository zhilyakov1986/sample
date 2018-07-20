using System.Collections.Generic;

namespace Model
{
    public partial class Customer : IHasDocuments<Document>
    {
        public virtual IEnumerable<Address> Addresses { get; set; } 
    }
}
