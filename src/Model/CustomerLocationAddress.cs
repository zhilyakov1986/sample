// <auto-generated>
// ReSharper disable ConvertPropertyToExpressionBody
// ReSharper disable DoNotCallOverridableMethodsInConstructor
// ReSharper disable EmptyNamespace
// ReSharper disable InconsistentNaming
// ReSharper disable PartialMethodWithSinglePart
// ReSharper disable PartialTypeWithSinglePart
// ReSharper disable RedundantNameQualifier
// ReSharper disable RedundantOverridenMember
// ReSharper disable UseNameofExpression
// TargetFrameworkVersion = 4.6
#pragma warning disable 1591    //  Ignore "Missing XML Comment" warning

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Model
{
    using Newtonsoft.Json;
    using System;
    using System.ComponentModel.DataAnnotations;
    using TrackerEnabledDbContext;

    // CustomerLocationAddresses
    [Table("CustomerLocationAddresses", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class CustomerLocationAddress: BaseEntity
    {
        // CustomerLocationAddress
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"CustomerLocationId", Order = 1, TypeName = "int")]
        [Index(@"PK_CustomerLocationAddresses", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Customer location ID")]
        public int CustomerLocationId { get; set; } // CustomerLocationId (Primary key)

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"AddressId", Order = 2, TypeName = "int")]
        [Index(@"PK_CustomerLocationAddresses", 2, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Address ID")]
        public int AddressId { get; set; } // AddressId (Primary key)

        [Column(@"IsPrimary", Order = 3, TypeName = "bit")]
        [Display(Name = "Is primary")]
        public bool IsPrimary { get; set; } // IsPrimary

        // Foreign keys

        /// <summary>
        /// Parent Address pointed by [CustomerLocationAddresses].([AddressId]) (FK_CustomerLocationAddresses_Addresses)
        /// </summary>
        [ForeignKey("AddressId")] public Address Address { get; set; } // FK_CustomerLocationAddresses_Addresses

        /// <summary>
        /// Parent CustomerLocation pointed by [CustomerLocationAddresses].([CustomerLocationId]) (FK_CustomerLocationAddresses_CustomerLocations)
        /// </summary>
        [ForeignKey("CustomerLocationId")] public CustomerLocation CustomerLocation { get; set; } // FK_CustomerLocationAddresses_CustomerLocations

        public CustomerLocationAddress()
        {
            IsPrimary = false;
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>