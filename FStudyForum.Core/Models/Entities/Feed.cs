using System.ComponentModel.DataAnnotations.Schema;

namespace FStudyForum.Core.Models.Entities;
[Table("tblFeeds")]
public class Feed : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public virtual ApplicationUser? Creater { get; set; }
    public virtual ICollection<Topic> Topics { get; set; } = new List<Topic>();
}
