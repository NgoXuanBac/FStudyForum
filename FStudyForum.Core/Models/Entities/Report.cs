using System.ComponentModel.DataAnnotations.Schema;

namespace FStudyForum.Core.Models.Entities;

[Table("tblReports")]
public class Report : BaseEntity
{
    public string Type { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ResponseContent { get; set; } = string.Empty;
    public required virtual ApplicationUser Creater { get; set; }
}
