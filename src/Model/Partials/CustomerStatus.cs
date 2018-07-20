using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(CustomerStatusMetaData))]
    public partial class CustomerStatus
    {
        internal sealed class CustomerStatusMetaData
        {
            private CustomerStatusMetaData()
            { }

            [JsonIgnore]
            public ICollection<Customer> Customers { get; set; } // Customers.FK_Customers_CustomerStatuses
        }
    }
}