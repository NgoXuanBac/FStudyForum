using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FStudyForum.Core.Models.Entities;

public class BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; private set; } = DateTime.Now;
}


public class BaseEntity<T>
{
    [Key]
    public required T Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ModifiedAt { get; private set; } = DateTime.Now;
}
