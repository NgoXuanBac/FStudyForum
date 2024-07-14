using FStudyForum.Core.Models.DTOs.Topic;

namespace FStudyForum.Core.Models.DTOs.User;

public class UserDTO
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Banner { get; set; } = string.Empty;
    public IEnumerable<TopicDTO> Mods { get; set; } = [];
    public IList<string> Roles { get; set; } = [];

}
