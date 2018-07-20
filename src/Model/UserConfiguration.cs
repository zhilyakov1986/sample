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

    // Users
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class UserConfiguration : System.Data.Entity.ModelConfiguration.EntityTypeConfiguration<User>
    {
        public UserConfiguration()
            : this("dbo")
        {
        }

        public UserConfiguration(string schema)
        {
            Property(x => x.FirstName).IsUnicode(false);
            Property(x => x.LastName).IsUnicode(false);
            Property(x => x.Email).IsUnicode(false);
            Property(x => x.ImageId).IsOptional();
            Property(x => x.AddressId).IsOptional();
            Property(x => x.Version).IsFixedLength();

            HasMany(t => t.ServiceAreas).WithMany(t => t.Users).Map(m =>
            {
                m.ToTable("UserServiceAreas", "dbo");
                m.MapLeftKey("UserId");
                m.MapRightKey("ServiceAreaId");
            });
            InitializePartial();
        }
        partial void InitializePartial();
    }

}
// </auto-generated>