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

    // __RefactorLog
    ///<summary>
    /// refactoring log
    ///</summary>
    [Table("__RefactorLog", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class RefactorLog: BaseEntity
    {
        // __RefactorLog
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column(@"OperationKey", Order = 1, TypeName = "uniqueidentifier")]
        [Index(@"PK____Refact__D3AEFFDB1A9C10FA", 1, IsUnique = true, IsClustered = true)]
        [Key]
        [Display(Name = "Operation key")]
        public System.Guid OperationKey { get; set; } // OperationKey (Primary key)

        public RefactorLog()
        {
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
