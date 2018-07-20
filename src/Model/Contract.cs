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

    // Contracts
    [Table("Contracts", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class Contract: Entity, IVersionable
    {
        // Contract

        [Column(@"Number", Order = 2, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Number")]
        public string Number { get; set; } // Number (length: 50)

        [Column(@"StartDate", Order = 3, TypeName = "datetime")]
        [Display(Name = "Start date")]
        public System.DateTime StartDate { get; set; } // StartDate

        [Column(@"EndDate", Order = 4, TypeName = "datetime")]
        [Display(Name = "End date")]
        public System.DateTime EndDate { get; set; } // EndDate

        [Column(@"CustomerId", Order = 5, TypeName = "int")]
        [Display(Name = "Customer ID")]
        public int CustomerId { get; set; } // CustomerId

        [Column(@"UserId", Order = 6, TypeName = "int")]
        [Display(Name = "User ID")]
        public int? UserId { get; set; } // UserId

        [Column(@"StatusId", Order = 7, TypeName = "int")]
        [Display(Name = "Status ID")]
        public int StatusId { get; set; } // StatusId

        [Column(@"ServiceDivisionId", Order = 8, TypeName = "int")]
        [Display(Name = "Service division ID")]
        public int ServiceDivisionId { get; set; } // ServiceDivisionId

        [Column(@"Archived", Order = 9, TypeName = "bit")]
        [Display(Name = "Archived")]
        public bool Archived { get; set; } // Archived

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Column(@"Version", Order = 10, TypeName = "timestamp")]
        [MaxLength(8)]
        [Timestamp]
        [Display(Name = "Version")]
        public byte[] Version { get; set; } // Version (length: 8)

        // Reverse navigation

        /// <summary>
        /// Child LocationServices where [LocationServices].[ContractId] point to this entity (FK_LocationServices_Contracts)
        /// </summary>
        public System.Collections.Generic.ICollection<LocationService> LocationServices { get; set; } // LocationServices.FK_LocationServices_Contracts
        /// <summary>
        /// Child ServiceAreas (Many-to-Many) mapped by table [ContractServiceAreas]
        /// </summary>
        public System.Collections.Generic.ICollection<ServiceArea> ServiceAreas { get; set; } // Many to many mapping

        // Foreign keys

        /// <summary>
        /// Parent Customer pointed by [Contracts].([CustomerId]) (FK_Contracts_Customers)
        /// </summary>
        [ForeignKey("CustomerId")] public Customer Customer { get; set; } // FK_Contracts_Customers

        /// <summary>
        /// Parent ServiceDivision pointed by [Contracts].([ServiceDivisionId]) (FK_Contracts_ServiceDivisions)
        /// </summary>
        [ForeignKey("ServiceDivisionId")] public ServiceDivision ServiceDivision { get; set; } // FK_Contracts_ServiceDivisions

        /// <summary>
        /// Parent ContractStatus pointed by [Contracts].([StatusId]) (FK_Contracts_ContractStatuses)
        /// </summary>
        [ForeignKey("StatusId")] public ContractStatus ContractStatus { get; set; } // FK_Contracts_ContractStatuses

        /// <summary>
        /// Parent User pointed by [Contracts].([UserId]) (FK_Contracts_Users)
        /// </summary>
        [ForeignKey("UserId")] public User User { get; set; } // FK_Contracts_Users

        public Contract()
        {
            StatusId = 1;
            LocationServices = new System.Collections.Generic.List<LocationService>();
            ServiceAreas = new System.Collections.Generic.List<ServiceArea>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>