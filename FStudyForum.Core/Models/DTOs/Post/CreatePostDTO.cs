using FStudyForum.Core.Models.DTOs.Attachment;

namespace FStudyForum.Core.Models.DTOs.Post;

public class CreatePostDTO
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? TopicName { get; set; }
    public string? Author { get; set; }
    public IEnumerable<AttachmentDTO> Attachments { get; set; } = [];
}
