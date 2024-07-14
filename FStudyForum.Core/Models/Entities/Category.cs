using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudyForum.Core.Models.Entities;

[Table("tblCategories")]
public class Category : BaseEntity
{
    [MaxLength(50)]
    public required string Name { get; set; }
    [MaxLength(300)]
    public required string Description { get; set; }
    [MaxLength(50)]
    public required string Type { get; set; }
    // public bool IsDeleted { get; set; }
    public virtual ICollection<Topic> Topics { get; set; } = new List<Topic>();

}
