using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Models.DTOs.Post;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using FStudyForum.Core.Helpers;
using FStudyForum.Core.Models.DTOs.Topic;
using FStudyForum.Core.Models.DTOs.Search;
using FStudyForum.Core.Constants;


namespace FStudyForum.Infrastructure.Repositories
{
    public class PostRepository(ApplicationDBContext dbContext)
        : BaseRepository<Post>(dbContext), IPostRepository
    {
        public async Task<Post> CreatePostAsync(CreatePostDTO postDTO)
        {
            Topic? topic = null;

            if (!string.IsNullOrEmpty(postDTO.TopicName))
                topic = await _dbContext.Topics.FirstAsync(t => t.Name == postDTO.TopicName)
                    ?? throw new Exception("Topic not found");

            var creater = await _dbContext.Users.FirstAsync(u => u.UserName == postDTO.Author)
                ?? throw new Exception("User not found");

            var post = new Post
            {
                Title = postDTO.Title,
                Content = postDTO.Content,
                Topic = topic,
                Creater = creater,
                CreatedAt = DateTime.Now
            };
            var attachments = new List<Attachment>();
            foreach (var attachmentDTO in postDTO.Attachments)
            {
                attachments.Add(new Attachment
                {
                    Type = attachmentDTO.Type,
                    Url = attachmentDTO.Url,
                    Name = attachmentDTO.Name,
                    Size = attachmentDTO.Size,
                    Post = post,
                    CreatedAt = DateTime.Now
                });
            }
            post.Attachments = attachments;
            await Create(post);
            return post;
        }


        public async Task<Post> EditPostAsync(Post post, EditPostDTO postDTO)
        {
            var attachments = new List<Attachment>();
            foreach (var attachmentDTO in postDTO.Attachments)
            {
                attachments.Add(new Attachment
                {
                    Type = attachmentDTO.Type,
                    Url = attachmentDTO.Url,
                    Name = attachmentDTO.Name,
                    Size = attachmentDTO.Size,
                    Post = post,
                    CreatedAt = DateTime.Now
                });
            }
            post.Attachments.Clear();
            post.Attachments = attachments;
            post.Content = postDTO.Content;
            post.Title = postDTO.Title;
            await Update(post);
            return post;
        }

        public async Task MovePostToTrashAsync(Post post)
        {
            post.IsDeleted = true;
            await Update(post);
        }
        public async Task RestorePostFromTrashAsync(Post post)
        {
            post.IsDeleted = false;
            await Update(post);
        }

        public async Task DeletePostForeverAsync(Post post)
        {
            post.IsDeletedForever = true;
            await Update(post);
        }

        public async Task RemoveFromSavedByUser(SavedPost postByUser)
        {
            _dbContext.SavedPosts.Remove(postByUser);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<SavedPost?> FindPostByUser(SavePostDTO savePostDTO)
        {
            return await _dbContext.SavedPosts.FirstOrDefaultAsync(p => p.Post.Id == savePostDTO.PostId
            && p.User.UserName == savePostDTO.UserName);
        }

        public async Task<bool> IsSaved(string userName, long postId)
        {
            var post = await _dbContext.SavedPosts.FirstOrDefaultAsync(p => p.Post.Id == postId
            && p.User.UserName == userName);
            return post != null;
        }

        public async Task SavePost(SavedPost savedPost)
        {
            await _dbContext.SavedPosts.AddAsync(savedPost);
            await _dbContext.SaveChangesAsync();
        }

        public async Task AddOrUpdateRecentPost(RecentPost recentPost)
        {
            var existedPost = await _dbContext.RecentPosts
                .Where(rp => rp.User.UserName == recentPost.User.UserName)
                .OrderBy(rp => rp.CreatedAt)
                .ToListAsync();

            while (existedPost.Count > 9)
            {
                _dbContext.RecentPosts.Remove(existedPost.First());
                existedPost.RemoveAt(0);
            }

            var rPost = await _dbContext.RecentPosts.FirstOrDefaultAsync(rp => rp.Post.Id == recentPost.Post.Id
                && rp.User.UserName == recentPost.User.UserName);
            if (rPost != null)
                _dbContext.RecentPosts.Remove(rPost);

            await _dbContext.RecentPosts.AddAsync(recentPost);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> IsExistInRecent(RecentPostDTO recentPostDTO)
        {
            var post = await _dbContext.RecentPosts.FirstOrDefaultAsync(p => p.Post.Id == recentPostDTO.PostId
            && p.User.UserName == recentPostDTO.UserName);
            return post == null;
        }

        public async Task<Post?> GetPostByIdAsync(long id, bool isDeleted = false)
        {
            return await _dbContext.Posts
                .Where(p => p.IsDeleted == isDeleted && p.Id == id)
                .Include(p => p.Creater)
                .Include(p => p.Creater.Profile)
                .Include(p => p.Topic)
                .Include(p => p.Votes)
                .Include(p => p.Attachments)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsAsync(QueryPostDTO query)
        {
            IQueryable<Post> queryable = _dbContext.Posts
                .Include(p => p.Topic)
                .Where(p => !p.IsDeletedForever && (p.Topic == null || !p.Topic.IsDeleted))
                .Include(p => p.Creater)
                .Include(p => p.Creater.Profile)
                .Include(p => p.Votes)
                .Include(p => p.Attachments)
                .Include(p => p.Comments);

            queryable = query.Type switch
            {
                PostType.IN_PROFILE => queryable.Where(p => p.Topic == null && !p.IsDeleted),
                PostType.IN_TRASH => queryable.Where(p => p.IsDeleted),
                _ => queryable.Where(p => p.Topic != null && !p.IsDeleted)
            };

            if (!string.IsNullOrEmpty(query.Topic))
                queryable = queryable.Where(p => p.Topic != null && p.Topic.Name == query.Topic);

            if (!string.IsNullOrEmpty(query.User))
                queryable = queryable.Where(p => p.Creater.UserName == query.User);
            if (!string.IsNullOrEmpty(query.Keyword))
                queryable = queryable.Where(p => p.Title.Contains(query.Keyword) || p.Content.Contains(query.Keyword));
            if (!string.IsNullOrEmpty(query.Filter))
                queryable = query.Filter switch
                {
                    "Hot" => queryable.OrderByDescending(p => p.Votes.Sum(v => v.IsUp ? 1 : 0) + p.Comments.Count),
                    "New" => queryable.OrderByDescending(p => p.CreatedAt),
                    _ => queryable.OrderBy(p => p.Id),
                };
            return await queryable
                .Paginate(query.PageNumber, query.PageSize)
                .ToListAsync();
        }

        public async Task<int> GetVoteCount(long id)
        {
            return await _dbContext.Votes
                    .Where(v => v.Post != null && v.Post.Id == id)
                    .SumAsync(v => v.IsUp ? 1 : -1);
        }

        public async Task<IList<Post>?> GetVotedPosts(string username)
        {
            var posts = await _dbContext.Votes
                .Include(v => v.Voter)
                .Include(v => v.Post)
                .Where(v => v.Voter.UserName == username && v.Post != null)
                .Select(v => v.Post!)
                .Distinct()
                .ToListAsync();
            return posts;
        }


        public async Task<IEnumerable<Post>> SearchPostAsync(QuerySearchPostDTO query)
        {
            IQueryable<Post> queryable = _dbContext.Posts
             .Include(p => p.Topic)
             .Include(p => p.Creater)
             .Include(p => p.Votes)
             .Include(p => p.Attachments)
             .Include(p => p.Comments)
             .AsSplitQuery()
             .Where(p => !p.IsDeleted && p.Topic != null && !p.Topic.IsDeleted
                 && p.Title.ToLower().Contains(query.Keyword.Trim().ToLower()));
            if (!string.IsNullOrEmpty(query.User))
                queryable = queryable.Where(p => p.Creater.UserName == query.User);
            if (!string.IsNullOrEmpty(query.Topic))
                queryable = queryable.Where(p => p.Topic != null && p.Topic.Name == query.Topic);
            queryable = query.Filter switch
            {
                "Hot" => queryable.OrderByDescending(p => p.Votes.Sum(v => v.IsUp ? 1 : 0) + p.Comments.Count),
                "New" => queryable.OrderByDescending(p => p.CreatedAt),
                _ => queryable.OrderBy(p => p.Id),
            };
            return await queryable
                .Paginate(query.PageNumber, query.PageSize)
                .ToListAsync();
        }
        public async Task<IEnumerable<Post>> GetSavedPostsByUser(string username)
        {
            var posts = await _dbContext.SavedPosts
            .Where(sp => sp.User.UserName == username && !sp.Post.IsDeleted)
            .Include(sp => sp.Post)
            .Include(sp => sp.Post.Creater)
            .Include(sp => sp.Post.Creater.Profile)
            .Include(sp => sp.Post.Topic)
            .Include(sp => sp.Post.Votes)
            .Include(sp => sp.Post.Comments)
            .Include(sp => sp.Post.Attachments)
            .Where(sp => sp.Post.Topic == null || !sp.Post.Topic.IsDeleted)
            .Select(sp => sp.Post)
            .ToListAsync();
            return posts;
        }

        public async Task<IEnumerable<Post>> GetRecentPosts(string username)
        {
            var posts = await _dbContext.RecentPosts
                .Where(rp => rp.User.UserName == username && !rp.Post.IsDeleted)
                .Include(rp => rp.Post)
                .Include(rp => rp.Post.Creater)
                .Include(rp => rp.Post.Creater.Profile)
                .Include(rp => rp.Post.Topic)
                .Include(rp => rp.Post.Votes)
                .Include(rp => rp.Post.Comments)
                .Include(rp => rp.Post.Attachments)
                .Where(rp => rp.Post.Topic == null || !rp.Post.Topic.IsDeleted)
                .Select(rp => rp.Post)
                .ToListAsync();
            return posts;
        }

        public async Task ClearRecentPosts(string username)
        {
            var recentPosts = _dbContext.RecentPosts
                .Where(rp => rp.User.UserName == username);
            _dbContext.RecentPosts.RemoveRange(recentPosts);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<IEnumerable<Post>> GetStatisticsPost(DateTime startDate, DateTime endDate)
        {
            var posts = await _dbContext.Posts
                .Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate)
                .Include(p => p.Creater)
                .Include(p => p.Topic)
                .Include(p => p.Votes)
                .Include(p => p.Attachments)
                .Include(p => p.Comments)
                .ToListAsync();
            return posts;
        }
    }
}
