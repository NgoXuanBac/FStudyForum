using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Models.DTOs.Comment;
using FStudyForum.Core.Models.DTOs.Search;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using FStudyForum.Core.Helpers;

namespace FStudyForum.Infrastructure.Repositories
{
    public class CommentRepository : BaseRepository<Comment>, ICommentRepository
    {
        private readonly ApplicationDBContext _context;

        public CommentRepository(ApplicationDBContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Comment?> GetCommentByIdAsync(long id)
        {
            return await _context.Comments
               .Where(c => !c.IsDeleted)
                .Include(c => c.Creater)
                .Include(c => c.Post)
                .Include(c => c.Post.Topic)
                .Include(c => c.Creater.Profile)
                .Include(c => c.Replies)
                .Include(c => c.Votes)
                .FirstOrDefaultAsync(c => c.Id == id);
        }


        public async Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(long postId)
        {
            return await _context.Comments
                .Where(c => c.Post.Id == postId && !c.IsDeleted)
                .Include(c => c.Creater)
                .Include(c => c.Creater.Profile)
                .Include(c => c.Post)
                .Include(c => c.Post.Topic)
                .Include(c => c.Replies)
                .Include(c => c.Votes)
                .ToListAsync();
        }
        public async Task<IEnumerable<Comment>> GetCommentsByReplyIdAsync(long replyId)
        {
            return await _context.Comments
                .Where(c => c.ReplyTo!.Id == replyId && !c.IsDeleted)
                .Include(c => c.Creater)
                .Include(c => c.Creater.Profile)
                .Include(c => c.Post)
                .Include(c => c.Post.Topic)
                .Include(c => c.Replies)
                .Include(c => c.Votes)
                .ToListAsync();
        }

        public async Task<IEnumerable<Comment>> GetCommentsByAttachmentIdAsync(long attachmentId)
        {
            return await _context.Comments
                .Where(c => c.Attachment != null && c.Attachment.Id == attachmentId && !c.IsDeleted)
                .Include(c => c.Replies)
                .ToListAsync();
        }

        public async Task<Comment> AddCommentAsync(CreateCommentDTO createCommentDTO)
        {
            var post = await _context.Posts.Include(p => p.Topic).FirstAsync(p => p.Id == createCommentDTO.PostId);
            var creater = await _dbContext.Users.FirstAsync(u => u.UserName == createCommentDTO.Author);
            Comment? replyTo = null;
            if (createCommentDTO.ReplyId != null)
            {
                replyTo = await _dbContext.Comments.FirstOrDefaultAsync(c => c.Id == createCommentDTO.ReplyId);
            }
            Attachment? attachment = null;
            if (createCommentDTO.AttachmentId != null)
            {
                attachment = await _dbContext.Attachments.FirstOrDefaultAsync(a => a.Id == createCommentDTO.AttachmentId);
            }
            var comment = new Comment
            {
                Content = createCommentDTO.Content,
                Post = post,
                Creater = creater,
                CreatedAt = DateTime.Now,
                ReplyTo = replyTo,
                Attachment = attachment
            };
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task UpdateCommentAsync(Comment comment)
        {
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetVoteCount(long id)
        {
            return await _dbContext.Votes
                    .Where(v => v.Comment != null && v.Comment.Id == id)
                    .SumAsync(v => v.IsUp ? 1 : -1);
        }


        public async Task<IEnumerable<Comment?>> SearchCommentAsync(QuerySearchCommentDTO query)
        {
            IQueryable<Comment> queryable = _context.Comments
              .Include(c => c.Creater)
              .Include(c => c.Creater.Profile)
              .Include(c => c.Post)
              .Include(c => c.Replies)
              .Include(c => c.Votes)
              .AsSplitQuery()
              .Where(c => !c.IsDeleted && c.Content.ToLower().Contains(query.Keyword.Trim().ToLower()));
            if (!string.IsNullOrEmpty(query.User))
                queryable = queryable.Where(c => c.Creater.UserName == query.User);
              if (!string.IsNullOrEmpty(query.Topic))
                queryable = queryable.Where(c => c.Post.Topic!.Name == query.Topic);
            queryable = query.Filter switch
            {
                "Hot" => queryable.OrderByDescending(c => c.Votes.Sum(v => v.IsUp ? 1 : 0))
                                  .ThenByDescending(c => c.CreatedAt),
                "New" => queryable.OrderByDescending(c => c.CreatedAt),
                _ => queryable.OrderBy(p => p.Id),
            };
            return await queryable
                .Paginate(query.PageNumber, query.PageSize)
                .ToListAsync();
        }
    }
}
