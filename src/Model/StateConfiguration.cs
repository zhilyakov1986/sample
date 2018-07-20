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

    // States
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class StateConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<State>
    {
        public StateConfiguration()
            : this("dbo")
        {
        }

        public StateConfiguration(string schema)
        {
            Property(x => x.StateCode).IsFixedLength().IsUnicode(false);
            Property(x => x.Name).IsUnicode(false);
            Property(x => x.TaxRate).IsOptional().HasPrecision(7,6);
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
