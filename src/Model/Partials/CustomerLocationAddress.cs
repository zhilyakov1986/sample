using System.Collections.Generic;
using Model.Partials;

namespace Model
{
   public partial class CustomerLocationAddress : IEntityAddress
    {
        public virtual IEnumerable<Address> Addresses { get; set; }
    }
}
