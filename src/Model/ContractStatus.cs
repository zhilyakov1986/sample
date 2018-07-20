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

    // ContractStatuses
    [Table("ContractStatuses", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ContractStatus: Entity
    {
        // ContractStatus

        [Column(@"Name", Order = 2, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } // Name (length: 50)

        // Reverse navigation

        /// <summary>
        /// Child Contracts where [Contracts].[StatusId] point to this entity (FK_Contracts_ContractStatuses)
        /// </summary>
        public System.Collections.Generic.ICollection<Contract> Contracts { get; set; } // Contracts.FK_Contracts_ContractStatuses

        public ContractStatus()
        {
            Contracts = new System.Collections.Generic.List<Contract>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
