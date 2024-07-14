using System.ComponentModel.DataAnnotations;

namespace FStudyForum.Core.Models.DTOs.Token;

public class TokenDTO
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
