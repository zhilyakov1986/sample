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

    // Images
    [Table("Images", Schema = "dbo")]
    [System.CodeDom.Compiler.GeneratedCode("EF.Reverse.POCO.Generator", "2.36.0.0")]
    public partial class Image: Entity
    {
        // Image

        [Column(@"Name", Order = 2, TypeName = "varchar")]
        [MaxLength(50)]
        [StringLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } // Name (length: 50)

        [Column(@"ImagePath", Order = 3, TypeName = "varchar")]
        [MaxLength(100)]
        [StringLength(100)]
        [Display(Name = "Image path")]
        public string ImagePath { get; set; } // ImagePath (length: 100)

        [Column(@"ThumbnailPath", Order = 4, TypeName = "varchar")]
        [MaxLength(100)]
        [StringLength(100)]
        [Display(Name = "Thumbnail path")]
        public string ThumbnailPath { get; set; } // ThumbnailPath (length: 100)

        // Reverse navigation

        /// <summary>
        /// Child Users where [Users].[ImageId] point to this entity (FK_Users_Images)
        /// </summary>
        public System.Collections.Generic.ICollection<User> Users { get; set; } // Users.FK_Users_Images

        public Image()
        {
            Name = "";
            Users = new System.Collections.Generic.List<User>();
            InitializePartial();
        }

        partial void InitializePartial();
    }

}
// </auto-generated>
