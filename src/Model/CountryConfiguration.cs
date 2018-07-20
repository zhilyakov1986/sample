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
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class CountryConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<Country>
    {
        public CountryConfiguration()
            : this("dbo")
        {
        }

        public CountryConfiguration(string schema)
        {
            Property(x => x.CountryCode).IsFixedLength().IsUnicode(false);
            Property(x => x.Alpha3Code).IsFixedLength().IsUnicode(false);
            Property(x => x.Name).IsUnicode(false);
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>