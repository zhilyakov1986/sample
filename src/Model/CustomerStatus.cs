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

    // CustomerStatuses
    [Table("CustomerStatuses", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class CustomerStatus: Entity
    {
        // CustomerStatus

        [Column(@"Name", Order = 2, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } // Name (length: 50)

        [Column(@"Sort", Order = 3, TypeName = "int")]
        [Display(Name = "Sort")]
        public int Sort { get; set; } // Sort

        // Reverse navigation

        /// <summary>
        /// Child Customers where [Customers].[StatusId] point to this entity (FK_Customers_CustomerStatuses)
        /// </summary>
        public System.Collections.Generic.ICollection<Customer> Customers { get; set; } // Customers.FK_Customers_CustomerStatuses

        public CustomerStatus()
        {
            Sort = 0;
            Customers = new System.Collections.Generic.List<Customer>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>