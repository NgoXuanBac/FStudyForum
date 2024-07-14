
namespace FStudyForum.Core.Models.DTOs.Topic
{
    public class SavePostDTO
    {
        public required string UserName { get; set; }
        public required long PostId { get; set; }
    }
}
