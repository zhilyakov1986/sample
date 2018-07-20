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

    // CustomerAddresses
    [Table("CustomerAddresses", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class CustomerAddress: BaseEntity
    {
        // CustomerAddress
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"CustomerId", Order = 1, TypeName = "int")]
        [Index(@"PK_CustomerAddresses", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Customer ID")]
        public int CustomerId { get; set; } // CustomerId (Primary key)

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"AddressId", Order = 2, TypeName = "int")]
        [Index(@"PK_CustomerAddresses", 2, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Address ID")]
        public int AddressId { get; set; } // AddressId (Primary key)

        [Column(@"IsPrimary", Order = 3, TypeName = "bit")]
        [Display(Name = "Is primary")]
        public bool IsPrimary { get; set; } // IsPrimary

        // Foreign keys

        /// <summary>
        /// Parent Address pointed by [CustomerAddresses].([AddressId]) (FK_CustomerAddresses_Addresses)
        /// </summary>
        [ForeignKey("AddressId")] public Address Address { get; set; } // FK_CustomerAddresses_Addresses

        /// <summary>
        /// Parent Customer pointed by [CustomerAddresses].([CustomerId]) (FK_CustomerAddresses_Customers)
        /// </summary>
        [ForeignKey("CustomerId")] public Customer Customer { get; set; } // FK_CustomerAddresses_Customers

        public CustomerAddress()
        {
            IsPrimary = false;
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
