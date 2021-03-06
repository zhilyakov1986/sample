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


    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class PrimaryContext : BreckContext, IPrimaryContext
    {
        public System.Data.Entity.DbSet<Address> Addresses { get; set; } // Addresses
        public System.Data.Entity.DbSet<AuthApplicationType> AuthApplicationTypes { get; set; } // AuthApplicationTypes
        public System.Data.Entity.DbSet<AuthClient> AuthClients { get; set; } // AuthClients
        public System.Data.Entity.DbSet<AuthToken> AuthTokens { get; set; } // AuthTokens
        public System.Data.Entity.DbSet<AuthUser> AuthUsers { get; set; } // AuthUsers
        public System.Data.Entity.DbSet<ClaimType> ClaimTypes { get; set; } // ClaimTypes
        public System.Data.Entity.DbSet<ClaimValue> ClaimValues { get; set; } // ClaimValues
        public System.Data.Entity.DbSet<Contact> Contacts { get; set; } // Contacts
        public System.Data.Entity.DbSet<ContactPhone> ContactPhones { get; set; } // ContactPhones
        public System.Data.Entity.DbSet<ContactStatus> ContactStatus { get; set; } // ContactStatuses
        public System.Data.Entity.DbSet<Contract> Contracts { get; set; } // Contracts
        public System.Data.Entity.DbSet<ContractStatus> ContractStatus { get; set; } // ContractStatuses
        public System.Data.Entity.DbSet<Country> Countries { get; set; } // Countries
        public System.Data.Entity.DbSet<Customer> Customers { get; set; } // Customers
        public System.Data.Entity.DbSet<CustomerAddress> CustomerAddresses { get; set; } // CustomerAddresses
        public System.Data.Entity.DbSet<CustomerLocation> CustomerLocations { get; set; } // CustomerLocations
        public System.Data.Entity.DbSet<CustomerLocationAddress> CustomerLocationAddresses { get; set; } // CustomerLocationAddresses
        public System.Data.Entity.DbSet<CustomerPhone> CustomerPhones { get; set; } // CustomerPhones
        public System.Data.Entity.DbSet<CustomerSource> CustomerSources { get; set; } // CustomerSources
        public System.Data.Entity.DbSet<CustomerStatus> CustomerStatus { get; set; } // CustomerStatuses
        public System.Data.Entity.DbSet<Document> Documents { get; set; } // Documents
        public System.Data.Entity.DbSet<Good> Goods { get; set; } // Goods
        public System.Data.Entity.DbSet<Image> Images { get; set; } // Images
        public System.Data.Entity.DbSet<LocationService> LocationServices { get; set; } // LocationServices
        public System.Data.Entity.DbSet<Note> Notes { get; set; } // Notes
        public System.Data.Entity.DbSet<PhoneType> PhoneTypes { get; set; } // PhoneTypes
        public System.Data.Entity.DbSet<RefactorLog> RefactorLogs { get; set; } // __RefactorLog
        public System.Data.Entity.DbSet<ServiceArea> ServiceAreas { get; set; } // ServiceAreas
        public System.Data.Entity.DbSet<ServiceDivision> ServiceDivisions { get; set; } // ServiceDivisions
        public System.Data.Entity.DbSet<ServiceType> ServiceTypes { get; set; } // ServiceTypes
        public System.Data.Entity.DbSet<Setting> Settings { get; set; } // Settings
        public System.Data.Entity.DbSet<State> States { get; set; } // States
        public System.Data.Entity.DbSet<SubcontractorStatus> SubcontractorStatus { get; set; } // SubcontractorStatuses
        public System.Data.Entity.DbSet<UnitType> UnitTypes { get; set; } // UnitTypes
        public System.Data.Entity.DbSet<User> Users { get; set; } // Users
        public System.Data.Entity.DbSet<UserPhone> UserPhones { get; set; } // UserPhones
        public System.Data.Entity.DbSet<UserRole> UserRoles { get; set; } // UserRoles
        public System.Data.Entity.DbSet<UserRoleClaim> UserRoleClaims { get; set; } // UserRoleClaims
        public System.Data.Entity.DbSet<WorkOrderStatus> WorkOrderStatus { get; set; } // WorkOrderStatuses

        static PrimaryContext()
        {
            System.Data.Entity.Database.SetInitializer<PrimaryContext>(null);
        }

        public PrimaryContext()
            : base("Name=Primary")
        {
            InitializePartial();
        }

        public PrimaryContext(string connectionString)
            : base(connectionString)
        {
            InitializePartial();
        }

        public PrimaryContext(string connectionString, System.Data.Entity.Infrastructure.DbCompiledModel model)
            : base(connectionString, model)
        {
            InitializePartial();
        }

        public PrimaryContext(System.Data.Common.DbConnection existingConnection, bool contextOwnsConnection)
            : base(existingConnection, contextOwnsConnection)
        {
            InitializePartial();
        }

        public PrimaryContext(System.Data.Common.DbConnection existingConnection, System.Data.Entity.Infrastructure.DbCompiledModel model, bool contextOwnsConnection)
            : base(existingConnection, model, contextOwnsConnection)
        {
            InitializePartial();
        }

        protected override void Dispose(bool disposing)
        {
            DisposePartial(disposing);
            base.Dispose(disposing);
        }

        public bool IsSqlParameterNull(System.Data.SqlClient.SqlParameter param)
        {
            var sqlValue = param.SqlValue;
            var nullableValue = sqlValue as System.Data.SqlTypes.INullable;
            if (nullableValue != null)
                return nullableValue.IsNull;
            return (sqlValue == null || sqlValue == System.DBNull.Value);
        }

        protected override void OnModelCreating(System.Data.Entity.DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Configurations.Add(new AddressConfiguration());
            modelBuilder.Configurations.Add(new AuthApplicationTypeConfiguration());
            modelBuilder.Configurations.Add(new AuthClientConfiguration());
            modelBuilder.Configurations.Add(new AuthTokenConfiguration());
            modelBuilder.Configurations.Add(new AuthUserConfiguration());
            modelBuilder.Configurations.Add(new ClaimTypeConfiguration());
            modelBuilder.Configurations.Add(new ClaimValueConfiguration());
            modelBuilder.Configurations.Add(new ContactConfiguration());
            modelBuilder.Configurations.Add(new ContactPhoneConfiguration());
            modelBuilder.Configurations.Add(new ContactStatusConfiguration());
            modelBuilder.Configurations.Add(new ContractConfiguration());
            modelBuilder.Configurations.Add(new ContractStatusConfiguration());
            modelBuilder.Configurations.Add(new CountryConfiguration());
            modelBuilder.Configurations.Add(new CustomerConfiguration());
            modelBuilder.Configurations.Add(new CustomerAddressConfiguration());
            modelBuilder.Configurations.Add(new CustomerLocationConfiguration());
            modelBuilder.Configurations.Add(new CustomerLocationAddressConfiguration());
            modelBuilder.Configurations.Add(new CustomerPhoneConfiguration());
            modelBuilder.Configurations.Add(new CustomerSourceConfiguration());
            modelBuilder.Configurations.Add(new CustomerStatusConfiguration());
            modelBuilder.Configurations.Add(new DocumentConfiguration());
            modelBuilder.Configurations.Add(new GoodConfiguration());
            modelBuilder.Configurations.Add(new ImageConfiguration());
            modelBuilder.Configurations.Add(new LocationServiceConfiguration());
            modelBuilder.Configurations.Add(new NoteConfiguration());
            modelBuilder.Configurations.Add(new PhoneTypeConfiguration());
            modelBuilder.Configurations.Add(new RefactorLogConfiguration());
            modelBuilder.Configurations.Add(new ServiceAreaConfiguration());
            modelBuilder.Configurations.Add(new ServiceDivisionConfiguration());
            modelBuilder.Configurations.Add(new ServiceTypeConfiguration());
            modelBuilder.Configurations.Add(new SettingConfiguration());
            modelBuilder.Configurations.Add(new StateConfiguration());
            modelBuilder.Configurations.Add(new SubcontractorStatusConfiguration());
            modelBuilder.Configurations.Add(new UnitTypeConfiguration());
            modelBuilder.Configurations.Add(new UserConfiguration());
            modelBuilder.Configurations.Add(new UserPhoneConfiguration());
            modelBuilder.Configurations.Add(new UserRoleConfiguration());
            modelBuilder.Configurations.Add(new UserRoleClaimConfiguration());
            modelBuilder.Configurations.Add(new WorkOrderStatusConfiguration());

            OnModelCreatingPartial(modelBuilder);
        }

        public static System.Data.Entity.DbModelBuilder CreateModel(System.Data.Entity.DbModelBuilder modelBuilder, string schema)
        {
            modelBuilder.Configurations.Add(new AddressConfiguration(schema));
            modelBuilder.Configurations.Add(new AuthApplicationTypeConfiguration(schema));
            modelBuilder.Configurations.Add(new AuthClientConfiguration(schema));
            modelBuilder.Configurations.Add(new AuthTokenConfiguration(schema));
            modelBuilder.Configurations.Add(new AuthUserConfiguration(schema));
            modelBuilder.Configurations.Add(new ClaimTypeConfiguration(schema));
            modelBuilder.Configurations.Add(new ClaimValueConfiguration(schema));
            modelBuilder.Configurations.Add(new ContactConfiguration(schema));
            modelBuilder.Configurations.Add(new ContactPhoneConfiguration(schema));
            modelBuilder.Configurations.Add(new ContactStatusConfiguration(schema));
            modelBuilder.Configurations.Add(new ContractConfiguration(schema));
            modelBuilder.Configurations.Add(new ContractStatusConfiguration(schema));
            modelBuilder.Configurations.Add(new CountryConfiguration(schema));
            modelBuilder.Configurations.Add(new CustomerConfiguration(schema));
            modelBuilder.Configurations.Add(new CustomerAddressConfiguration(schema));
            modelBuilder.Configurations.Add(new CustomerLocationConfiguration(schema));
            modelBuilder.Configurations.Add(new CustomerLocationAddressConfiguration(schema));
            modelBuilder.Configurations.Add(new CustomerPhoneConfiguration(schema));
            modelBuilder.Configurations.Add(new CustomerSourceConfiguration(schema));
            modelBuilder.Configurations.Add(new CustomerStatusConfiguration(schema));
            modelBuilder.Configurations.Add(new DocumentConfiguration(schema));
            modelBuilder.Configurations.Add(new GoodConfiguration(schema));
            modelBuilder.Configurations.Add(new ImageConfiguration(schema));
            modelBuilder.Configurations.Add(new LocationServiceConfiguration(schema));
            modelBuilder.Configurations.Add(new NoteConfiguration(schema));
            modelBuilder.Configurations.Add(new PhoneTypeConfiguration(schema));
            modelBuilder.Configurations.Add(new RefactorLogConfiguration(schema));
            modelBuilder.Configurations.Add(new ServiceAreaConfiguration(schema));
            modelBuilder.Configurations.Add(new ServiceDivisionConfiguration(schema));
            modelBuilder.Configurations.Add(new ServiceTypeConfiguration(schema));
            modelBuilder.Configurations.Add(new SettingConfiguration(schema));
            modelBuilder.Configurations.Add(new StateConfiguration(schema));
            modelBuilder.Configurations.Add(new SubcontractorStatusConfiguration(schema));
            modelBuilder.Configurations.Add(new UnitTypeConfiguration(schema));
            modelBuilder.Configurations.Add(new UserConfiguration(schema));
            modelBuilder.Configurations.Add(new UserPhoneConfiguration(schema));
            modelBuilder.Configurations.Add(new UserRoleConfiguration(schema));
            modelBuilder.Configurations.Add(new UserRoleClaimConfiguration(schema));
            modelBuilder.Configurations.Add(new WorkOrderStatusConfiguration(schema));
            return modelBuilder;
        }

        partial void InitializePartial();
        partial void DisposePartial(bool disposing);
        partial void OnModelCreatingPartial(System.Data.Entity.DbModelBuilder modelBuilder);
    }
}
// </auto-generated>
