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

    // ContactPhones
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class ContactPhoneConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<ContactPhone>
    {
        public ContactPhoneConfiguration()
            : this("dbo")
        {
        }

        public ContactPhoneConfiguration(string schema)
        {
            Property(x => x.Phone).IsUnicode(false);
            Property(x => x.Extension).IsOptional().IsUnicode(false);

            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>
