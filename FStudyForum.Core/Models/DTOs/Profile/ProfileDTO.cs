
namespace FStudyForum.Core.Models.DTOs.Profile
{
    public class ProfileDTO
    {
        public string? Username { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int PostCount { get; set; }
        public int CommentCount { get; set; }
        public int Gender { get; set; }
        public string Major { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Banner { get; set; } = string.Empty;
    }
}
