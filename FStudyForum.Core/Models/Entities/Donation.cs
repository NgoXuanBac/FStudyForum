using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudyForum.Core.Models.Entities;

[Table("tblDonations")]
public class Donation : BaseEntity
{
    public long Amount { get; set; }
    [MaxLength(300)]
    public string Message { get; set; } = string.Empty;
    public required virtual ApplicationUser User { get; set; }
    [MaxLength(20)]
    public string? Tid { get; set; }
}
