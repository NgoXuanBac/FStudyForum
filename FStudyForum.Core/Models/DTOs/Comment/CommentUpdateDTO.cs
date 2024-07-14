using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudyForum.Core.Models.DTOs.Comment
{
    public class CommentUpdateDTO
    {
        public long CommentId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}