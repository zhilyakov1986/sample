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

    // PhoneTypes
    [Table("PhoneTypes", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class PhoneType: Entity
    {
        // PhoneType

        [Column(@"Name", Order = 2, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } // Name (length: 50)

        // Reverse navigation

        /// <summary>
        /// Child ContactPhones where [ContactPhones].[PhoneTypeId] point to this entity (FK_ContactPhones_PhoneTypes)
        /// </summary>
        public System.Collections.Generic.ICollection<ContactPhone> ContactPhones { get; set; } // ContactPhones.FK_ContactPhones_PhoneTypes
        /// <summary>
        /// Child CustomerPhones where [CustomerPhones].[PhoneTypeId] point to this entity (FK_CustomerPhones_PhoneTypes)
        /// </summary>
        public System.Collections.Generic.ICollection<CustomerPhone> CustomerPhones { get; set; } // CustomerPhones.FK_CustomerPhones_PhoneTypes
        /// <summary>
        /// Child UserPhones where [UserPhones].[PhoneTypeId] point to this entity (FK_UserPhones_PhoneTypes)
        /// </summary>
        public System.Collections.Generic.ICollection<UserPhone> UserPhones { get; set; } // UserPhones.FK_UserPhones_PhoneTypes

        public PhoneType()
        {
            UserPhones = new System.Collections.Generic.List<UserPhone>();
            ContactPhones = new System.Collections.Generic.List<ContactPhone>();
            CustomerPhones = new System.Collections.Generic.List<CustomerPhone>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
