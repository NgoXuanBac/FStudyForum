using System.ComponentModel.DataAnnotations;

namespace FStudyForum.Core.Models.DTOs.Auth;
public class ExternalAuthDTO
{
    [Required]
    public string Provider { get; set; } = string.Empty;
    [Required]
    public string IdToken { get; set; } = string.Empty;
}