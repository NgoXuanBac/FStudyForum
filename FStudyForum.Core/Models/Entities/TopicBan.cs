using System.ComponentModel.DataAnnotations.Schema;

namespace FStudyForum.Core.Models.Entities;

[Table("tblTopicBans")]
public class TopicBan : BaseEntity
{
    public required virtual ApplicationUser User { get; set; }
    public required virtual Topic Topic { get; set; }
    public required virtual DateTime BannedTime { get; set; }

}
