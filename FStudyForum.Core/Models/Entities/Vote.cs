using System.ComponentModel.DataAnnotations.Schema;

namespace FStudyForum.Core.Models.Entities;

[Table("tblVotes")]
public class Vote : BaseEntity
{
    public bool IsUp { get; set; }
    public required virtual ApplicationUser Voter { get; set; }
    public virtual Post? Post { get; set; }
    public virtual Comment? Comment { get; set; }
}
