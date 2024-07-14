using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FStudyForum.Core.Constants;

namespace FStudyForum.Core.Models.DTOs.Vote
{
    public class VoteCommentDTO
    {
        public long CommentId { get; set; }
        public VoteType Type { get; set; }
    }
}