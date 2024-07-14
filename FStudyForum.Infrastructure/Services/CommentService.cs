using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Comment;
using FStudyForum.Core.Models.DTOs.Search;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace FStudyForum.Infrastructure.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IVoteRepository _voteRepository;

        public CommentService(
            ICommentRepository commentRepository,
            UserManager<ApplicationUser> userManager,
            IVoteRepository voteRepository)
        {
            _commentRepository = commentRepository;
            _userManager = userManager;
            _voteRepository = voteRepository;
        }

        public async Task<CommentDTO> GetCommentByIdAsync(long id)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(id)
            ?? throw new Exception("Post not found");
            return await MapToCommentDTO(comment);
        }

        public async Task<IEnumerable<CommentDTO>> GetCommentsByPostIdAsync(long postId)
        {
            var comments = await _commentRepository.GetCommentsByPostIdAsync(postId);
            var commentDTOs = new List<CommentDTO>();
            foreach (var comment in comments)
            {
                commentDTOs.Add(await MapToCommentDTO(comment));
            }
            return commentDTOs;
        }

        public async Task<IEnumerable<CommentDTO>> GetCommentsByAttachmentIdAsync(long attachmentId)
        {
            var comments = await _commentRepository.GetCommentsByAttachmentIdAsync(attachmentId);
            var commentDTOs = new List<CommentDTO>();
            foreach (var comment in comments)
            {
                commentDTOs.Add(await MapToCommentDTO(comment));
            }

            return commentDTOs;
        }

        public async Task<CommentDTO> CreateCommentAsync(CreateCommentDTO commentCreateDto)
        {
            var comment = await _commentRepository.AddCommentAsync(commentCreateDto);
            return await MapToCommentDTO(comment);
        }



        public async Task<bool> SoftDeleteCommentAsync(long id)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(id)
            ?? throw new KeyNotFoundException("Comment not found");
            comment.IsDeleted = true;
            await _commentRepository.UpdateCommentAsync(comment);
            var commentReplies = await _commentRepository.GetCommentsByReplyIdAsync(id);
            foreach (var commentReply in commentReplies)
            {
                commentReply.IsDeleted = true;
                await SoftDeleteCommentAsync(commentReply.Id);
                await _commentRepository.UpdateCommentAsync(commentReply);
            }
            return true;
        }

        private async Task<CommentDTO> MapToCommentDTO(Comment comment)
        {
            if (comment.Creater.UserName == null)
                throw new Exception("Author not found");
            return new CommentDTO
            {
                Id = comment.Id,
                Content = comment.Content,
                IsDeleted = comment.IsDeleted,
                Author = comment.Creater.UserName,
                Avatar = comment.Creater.Profile?.Avatar,
                TopicName = comment.Post.Topic?.Name ?? "",
                PostId = comment.Post.Id,
                AttachmentId = comment.Attachment?.Id,
                ReplyId = comment.ReplyTo?.Id,
                VoteType = await _voteRepository.GetVotedCommentType(comment.Creater.UserName, comment.Id),
                VoteCount = await _commentRepository.GetVoteCount(comment.Id),
                Elapsed = DateTime.Now - comment.CreatedAt
            };
        }

        public async Task<IEnumerable<CommentDTO>> SearchCommentAsync(QuerySearchCommentDTO query)
        {
            var comments = await _commentRepository.SearchCommentAsync(query);
            var commentDTOs = new List<CommentDTO>();
            if (comments != null)
                foreach (var comment in comments)
                {
                    if (comment != null)
                        commentDTOs.Add(await MapToCommentDTO(comment));
                }
            return commentDTOs;
        }

        public async Task<bool> UpdateCommentAsync(CommentUpdateDTO commentUpdateDto)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(commentUpdateDto.CommentId)
            ?? throw new KeyNotFoundException("Comment not found");
            comment.Content = commentUpdateDto.Content;
            await _commentRepository.UpdateCommentAsync(comment);
            return true;
        }

        public async Task VoteAsync(long commentId, string user)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(commentId)
             ?? throw new KeyNotFoundException("Comment not found");
            var User = await _userManager.FindByNameAsync(user)
             ?? throw new KeyNotFoundException("User not found");
            var existingVote = comment.Votes.FirstOrDefault(v => v.Voter == User);
            if (existingVote != null)
            {
                comment.Votes.Remove(existingVote);
            }
            else
            {
                var vote = new Vote { Voter = User, Comment = comment };
                comment.Votes.Add(vote);
            }
            await _commentRepository.UpdateCommentAsync(comment);
        }

    }
}
