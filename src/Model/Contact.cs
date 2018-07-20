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

    // Contacts
    [Table("Contacts", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class Contact: Entity
    {
        // Contact

        [Column(@"FirstName", Order = 2, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "First name")]
        public string FirstName { get; set; } // FirstName (length: 50)

        [Column(@"LastName", Order = 3, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Last name")]
        public string LastName { get; set; } // LastName (length: 50)

        [Column(@"Title", Order = 4, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Title")]
        public string Title { get; set; } // Title (length: 50)

        [Column(@"Email", Order = 5, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; } // Email (length: 50)

        [Column(@"AddressId", Order = 6, TypeName = "int")]
        [Display(Name = "Address ID")]
        public int? AddressId { get; set; } // AddressId

        [Column(@"StatusId", Order = 7, TypeName = "int")]
        [Display(Name = "Status ID")]
        public int StatusId { get; set; } // StatusId

        // Reverse navigation

        /// <summary>
        /// Child ContactPhones where [ContactPhones].[ContactId] point to this entity (FK_ContactPhones_Contacts)
        /// </summary>
        public System.Collections.Generic.ICollection<ContactPhone> ContactPhones { get; set; } // ContactPhones.FK_ContactPhones_Contacts
        /// <summary>
        /// Child Customers (Many-to-Many) mapped by table [CustomerContacts]
        /// </summary>
        public System.Collections.Generic.ICollection<Customer> Customers { get; set; } // Many to many mapping

        // Foreign keys

        /// <summary>
        /// Parent Address pointed by [Contacts].([AddressId]) (FK_Contacts_Addresses)
        /// </summary>
        [ForeignKey("AddressId")] public Address Address { get; set; } // FK_Contacts_Addresses

        /// <summary>
        /// Parent ContactStatus pointed by [Contacts].([StatusId]) (FK_Contacts_ContactStatuses)
        /// </summary>
        [ForeignKey("StatusId")] public ContactStatus ContactStatus { get; set; } // FK_Contacts_ContactStatuses

        public Contact()
        {
            Title = "";
            Email = "";
            ContactPhones = new System.Collections.Generic.List<ContactPhone>();
            Customers = new System.Collections.Generic.List<Customer>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
