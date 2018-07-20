using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Model
{
    [MetadataType(typeof(CustomerSourceMetaData))]
    public partial class CustomerSource : IBasicNameEntity
    {
        internal sealed class CustomerSourceMetaData
        {
            private CustomerSourceMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<Customer> Customers { get; set; } // Customers.FK_Customers_CustomerSources
        }
    }
}