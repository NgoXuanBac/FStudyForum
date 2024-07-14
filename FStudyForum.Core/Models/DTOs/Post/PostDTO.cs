

using FStudyForum.Core.Constants;
using FStudyForum.Core.Models.DTOs.Attachment;


namespace FStudyForum.Core.Models.DTOs.Post
{
    public class PostDTO
    {
        public long Id { get; set; }
        public string TopicAvatar { get; set; } = string.Empty;
        public string TopicName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string AuthorAvatar { get; set; } = string.Empty;
        public VoteType VoteType { get; set; } = VoteType.UNVOTE;
        public int UpVoteCount { get; set; }
        public int DownVoteCount { get; set; }
        public int VoteCount { get; set; }
        public int CommentCount { get; set; }
        public bool IsSaved { get; set; }
        public bool InTrash { get; set; }
        public IEnumerable<AttachmentDTO> Attachments { get; set; } = [];
        public TimeSpan Elapsed { get; set; }
    }
}
