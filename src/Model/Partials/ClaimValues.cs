using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Model
{
    [MetadataType(typeof(ClaimValueMetaData))]
    public partial class ClaimValue
    {
        internal sealed class ClaimValueMetaData
        {
            private ClaimValueMetaData()
            {
            }

            [JsonIgnore]
            public ICollection<UserRoleClaim> UserRoleClaims { get; set; } // Many to many mapping
        }
    }
}