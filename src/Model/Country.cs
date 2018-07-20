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

    // Countries
    [Table("Countries", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class Country: BaseEntity
    {
        // Country
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"CountryCode", Order = 1, TypeName = "char")]
        [Index(@"PK__Countrie__5D9B0D2D595F7A54", 1, IsUnique = true, IsClustered = true)]
        [MaxLength(2)]
        [StringLength(2)]
        [Key]
        [Display(Name = "Country code")]
        public string CountryCode { get; set; } // CountryCode (Primary key) (length: 2)

        [Column(@"Alpha3Code", Order = 2, TypeName = "char")]
        [MaxLength(3)]
        [StringLength(3)]
        [Display(Name = "Alpha 3 code")]
        public string Alpha3Code { get; set; } // Alpha3Code (length: 3)

        [Column(@"Name", Order = 3, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } // Name (length: 50)

        // Reverse navigation

        /// <summary>
        /// Child Addresses where [Addresses].[CountryCode] point to this entity (FK_Addresses_Countries)
        /// </summary>
        public System.Collections.Generic.ICollection<Address> Addresses { get; set; } // Addresses.FK_Addresses_Countries

        public Country()
        {
            Addresses = new System.Collections.Generic.List<Address>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
