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

    // ServiceAreas
    [Table("ServiceAreas", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ServiceArea: Entity
    {
        // ServiceArea

        [Column(@"Name", Order = 2, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } // Name (length: 50)

        // Reverse navigation

        /// <summary>
        /// Child Contracts (Many-to-Many) mapped by table [ContractServiceAreas]
        /// </summary>
        public System.Collections.Generic.ICollection<Contract> Contracts { get; set; } // Many to many mapping
        /// <summary>
        /// Child CustomerLocations where [CustomerLocations].[ServiceAreaId] point to this entity (FK_CustomerLocations_ServiceArea)
        /// </summary>
        public System.Collections.Generic.ICollection<CustomerLocation> CustomerLocations { get; set; } // CustomerLocations.FK_CustomerLocations_ServiceArea
        /// <summary>
        /// Child Users (Many-to-Many) mapped by table [UserServiceAreas]
        /// </summary>
        public System.Collections.Generic.ICollection<User> Users { get; set; } // Many to many mapping

        public ServiceArea()
        {
            CustomerLocations = new System.Collections.Generic.List<CustomerLocation>();
            Contracts = new System.Collections.Generic.List<Contract>();
            Users = new System.Collections.Generic.List<User>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>