using FStudyForum.Core.Models.DTOs.Attachment;

namespace FStudyForum.Core.Models.DTOs.Post;

public class EditPostDTO
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public IEnumerable<AttachmentDTO> Attachments { get; set; } = [];
}
