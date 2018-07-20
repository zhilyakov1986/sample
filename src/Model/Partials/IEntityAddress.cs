using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Partials
{
    public interface IEntityAddress
    {
        int AddressId { get; set; }
        bool IsPrimary { get; set; }
    }
}
