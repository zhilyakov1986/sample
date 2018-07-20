using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Model
{
    [MetadataType(typeof(ClaimTypeMetaData))]
    public partial class ClaimType
    {
        internal sealed class ClaimTypeMetaData
        {
            private ClaimTypeMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<UserRoleClaim> UserRoleClaims { get; set; } // Many to many mapping

        }
    }
}