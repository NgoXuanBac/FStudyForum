using System.ComponentModel.DataAnnotations;

namespace FStudyForum.Core.Models.DTOs.User;

public class CreateUserDTO
{
    [Required, EmailAddress]
    public string Username { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = [];
}
