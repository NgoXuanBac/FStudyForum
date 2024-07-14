using FStudyForum.Core.Constants;

namespace FStudyForum.Core.Models.DTOs.Comment;

public class CommentDTO
{
    public long Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsDeleted { get; set; } = false;
    public string TopicName { get; set; } = string.Empty;
    public string? Author { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public VoteType VoteType { get; set; } = VoteType.UNVOTE;
    public int VoteCount { get; set; }
    public long PostId { get; set; }
    public long? AttachmentId { get; set; }
    public long? ReplyId { get; set; }
    public TimeSpan Elapsed { get; set; }

}