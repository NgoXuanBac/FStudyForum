using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FStudyForum.Core.Models.DTOs.Comment;
using FStudyForum.Core.Models.DTOs.Search;
using FStudyForum.Core.Models.Entities;
using Microsoft.EntityFrameworkCore.Update.Internal;

namespace FStudyForum.Core.Interfaces.IRepositories
{
    public interface ICommentRepository : IBaseRepository<Comment>
    {
        Task<Comment?> GetCommentByIdAsync(long id);
        Task<IEnumerable<Comment?>> SearchCommentAsync(QuerySearchCommentDTO query);
        Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(long postId);
        Task<IEnumerable<Comment>> GetCommentsByReplyIdAsync(long replyId);
        Task<IEnumerable<Comment>> GetCommentsByAttachmentIdAsync(long attachmentId);
        Task<Comment> AddCommentAsync(CreateCommentDTO createCommentDTO);
        public Task<int> GetVoteCount(long Id);
        Task UpdateCommentAsync(Comment comment);
    }
}