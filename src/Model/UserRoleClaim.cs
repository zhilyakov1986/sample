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

    // UserRoleClaims
    [Table("UserRoleClaims", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class UserRoleClaim: BaseEntity
    {
        // UserRoleClaim
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"RoleId", Order = 1, TypeName = "int")]
        [Index(@"PK_UserRoleClaims", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Role ID")]
        public int RoleId { get; set; } // RoleId (Primary key)

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"ClaimTypeId", Order = 2, TypeName = "int")]
        [Index(@"PK_UserRoleClaims", 3, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Claim type ID")]
        public int ClaimTypeId { get; set; } // ClaimTypeId (Primary key)

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"ClaimValueId", Order = 3, TypeName = "int")]
        [Index(@"PK_UserRoleClaims", 2, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Claim value ID")]
        public int ClaimValueId { get; set; } // ClaimValueId (Primary key)

        // Foreign keys

        /// <summary>
        /// Parent ClaimType pointed by [UserRoleClaims].([ClaimTypeId]) (FK_UserRoleClaims_ClaimTypes)
        /// </summary>
        [ForeignKey("ClaimTypeId")] public ClaimType ClaimType { get; set; } // FK_UserRoleClaims_ClaimTypes

        /// <summary>
        /// Parent ClaimValue pointed by [UserRoleClaims].([ClaimValueId]) (FK_UserRoleClaims_ClaimValues)
        /// </summary>
        [ForeignKey("ClaimValueId")] public ClaimValue ClaimValue { get; set; } // FK_UserRoleClaims_ClaimValues

        /// <summary>
        /// Parent UserRole pointed by [UserRoleClaims].([RoleId]) (FK_UserRoleClaims_UserRoles)
        /// </summary>
        [ForeignKey("RoleId")] public UserRole UserRole { get; set; } // FK_UserRoleClaims_UserRoles

        public UserRoleClaim()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
