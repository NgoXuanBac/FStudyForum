using System.Data.SqlTypes;

namespace FStudyForum.Core.Models.DTOs.Comment
{
    public class CreateCommentDTO
    {
        public string Content { get; set; } = string.Empty;
        public string? Author { get; set; } = string.Empty;
        public long PostId { get; set; }
        public long? AttachmentId { get; set; }
        public long? ReplyId { get; set; }
    }
}