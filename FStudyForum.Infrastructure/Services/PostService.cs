using System.Linq.Dynamic.Core;
using AutoMapper;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Attachment;
using FStudyForum.Core.Models.DTOs.Post;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Identity;
using FStudyForum.Core.Models.DTOs.Topic;
using FStudyForum.Core.Models.DTOs.Search;


namespace FStudyForum.Infrastructure.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IVoteRepository _voteRepository;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public PostService(IPostRepository postRepository, IVoteRepository voteRepository, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _postRepository = postRepository;
            _voteRepository = voteRepository;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<SavePostDTO?> RemoveFromSavedByUser(SavePostDTO savedPost)
        {
            if (savedPost.UserName == null) throw new Exception("User not found");
            var postByUser = await _postRepository.FindPostByUser(savedPost)
                ?? throw new Exception("Not found");
            await _postRepository.RemoveFromSavedByUser(postByUser);
            return savedPost;
        }

        public async Task<PostDTO> CreatePost(CreatePostDTO postDTO)
        {
            var post = await _postRepository.CreatePostAsync(postDTO);
            return new PostDTO
            {
                Id = post.Id
            };
        }

        public async Task<PostDTO> GetPostById(long id, string username)
        {
            var post = await _postRepository.GetPostByIdAsync(id)
                ?? throw new Exception("Post not found");
            return await ConvertToPostDTO(username, post);
        }

        public async Task<IEnumerable<PostDTO>> GetPosts(string username, QueryPostDTO query)
        {
            var posts = await _postRepository.GetPostsAsync(query);
            var postDTOs = new List<PostDTO>();
            foreach (var p in posts)
            {
                postDTOs.Add(await ConvertToPostDTO(username, p));
            }
            return postDTOs;
        }

        public async Task<IEnumerable<PostDTO>> SearchPostAsync(string username, QuerySearchPostDTO query)
        {
            var posts = await _postRepository.SearchPostAsync(query);
            var postDTOs = new List<PostDTO>();
            foreach (var p in posts)
            {
                postDTOs.Add(await ConvertToPostDTO(username, p));
            }
            return postDTOs;
        }

        public async Task<SavePostDTO?> SavePostByUser(SavePostDTO savePostDTO)
        {
            if (savePostDTO.UserName == null) return null;
            if (await _postRepository.IsSaved(savePostDTO.UserName, savePostDTO.PostId))
                throw new Exception("Post is Exists.");
            var user = await _userManager.FindByNameAsync(savePostDTO.UserName)
                 ?? throw new Exception("User not found");
            var post = await _postRepository.GetById(savePostDTO.PostId)
            ?? throw new Exception(nameof(savePostDTO.PostId) + "is not valid");
            var savedPost = _mapper.Map<SavedPost>(savePostDTO);
            savedPost.User = user;
            savedPost.Post = post;
            await _postRepository.SavePost(savedPost);
            return savePostDTO;
        }

        public async Task<RecentPostDTO?> AddRecentPostByUser(RecentPostDTO recentPostDTO)
        {
            var user = await _userManager.FindByNameAsync(recentPostDTO.UserName)
                ?? throw new Exception("User not found");
            var post = await _postRepository.GetById(recentPostDTO.PostId)
                ?? throw new Exception(nameof(recentPostDTO.PostId) + "is not valid");
            var recentPost = _mapper.Map<RecentPost>(recentPostDTO);
            recentPost.User = user;
            recentPost.Post = post;
            await _postRepository.AddOrUpdateRecentPost(recentPost);
            return recentPostDTO;
        }

        public async Task<IEnumerable<PostDTO>> GetRecentPostsByUser(string username)
        {
            var posts = await _postRepository.GetRecentPosts(username)
                ?? throw new Exception("Not found.");
            var postDTOs = new List<PostDTO>();
            foreach (var p in posts)
            {
                postDTOs.Add(await ConvertToPostDTO(username, p));
            }
            return postDTOs;
        }

        private async Task<PostDTO> ConvertToPostDTO(string username, Post p)
        {
            return new PostDTO
            {
                Id = p.Id,
                Title = p.Title,
                Author = p.Creater.UserName!,
                AuthorAvatar = p.Creater.Profile?.Avatar ?? string.Empty,
                TopicName = p.Topic?.Name ?? string.Empty,
                TopicAvatar = p.Topic?.Avatar ?? string.Empty,
                VoteType = await _voteRepository.GetVotedType(username, p.Id),
                UpVoteCount = p.Votes.Count(v => v.IsUp),
                DownVoteCount = p.Votes.Count(v => !v.IsUp),
                VoteCount = await _postRepository.GetVoteCount(p.Id),
                CommentCount = p.Comments.Count,
                Content = p.Content,
                IsSaved = await _postRepository.IsSaved(username, p.Id),
                InTrash = p.IsDeleted,
                Attachments = _mapper.Map<AttachmentDTO[]>(p.Attachments),
                Elapsed = DateTime.Now - p.CreatedAt
            };
        }



        public async Task ClearRecentPostsByUser(string username)
        {
            await _postRepository.ClearRecentPosts(username);
        }

        public async Task<bool> IsPostSaved(SavePostDTO savedPostDTO)
        {
            return await _postRepository.IsSaved(savedPostDTO.UserName, savedPostDTO.PostId);
        }

        public async Task<IEnumerable<PostDTO>> GetSavedPostsByUser(string username)
        {
            var posts = await _postRepository.GetSavedPostsByUser(username);
            var postDTOs = new List<PostDTO>();
            foreach (var p in posts)
            {
                postDTOs.Add(await ConvertToPostDTO(username, p));
            }

            return postDTOs;
        }
        public async Task<IEnumerable<PostStatisticsDTO>> GetPostStatisticsDTO(string action, int date)
        {
            DateTime startDate, endDate = DateTime.Now;
            switch (action)
            {
                case "day":
                    startDate = endDate.AddDays(-date);
                    break;
                case "year":
                    startDate = new DateTime(date, 1, 1);
                    endDate = new DateTime(date, 12, 31);
                    break;
                case "month":
                    startDate = new DateTime(endDate.Year, date, 1);
                    int daysInMonth = DateTime.DaysInMonth(endDate.Year, date);
                    endDate = new DateTime(endDate.Year, date, daysInMonth);
                    break;
                default:
                    throw new Exception("Invalid period");
            }
            var postStatistics = await _postRepository.GetStatisticsPost(startDate, endDate);
            var groupedSthatistics = postStatistics
                .GroupBy(p => p.CreatedAt.Date)
                .Select(group => new PostStatisticsDTO
                {
                    Date = DateOnly.FromDateTime(group.Key),
                    TotalPosts = group.Count(),
                    TotalVotes = group.Sum(p => p.Votes.Count()),
                    TotalComments = group.Sum(p => p.Comments.Count()),
                });
            var allDates = Enumerable.Range(0, (endDate.Date - startDate.Date).Days + 1)
                .Select(offset => startDate.Date.AddDays(offset))
                .ToList();
            var completeStatistics = allDates.Select(date =>
                groupedSthatistics.FirstOrDefault(stat => stat.Date == DateOnly.FromDateTime(date)) ?? new PostStatisticsDTO
                {
                    Date = DateOnly.FromDateTime(date),
                    TotalPosts = 0,
                    TotalVotes = 0,
                    TotalComments = 0
                });
            return completeStatistics;
        }

        public async Task MovePostToTrash(long id, string username)
        {
            var post = await _postRepository.GetPostByIdAsync(id)
                ?? throw new Exception("Post not found");
            if (post.Creater.UserName != username)
                throw new Exception("Not the author of the post");
            await _postRepository.MovePostToTrashAsync(post);
        }

        public async Task DeletePost(long id, string username)
        {
            var post = await _postRepository.GetPostByIdAsync(id, true)
                ?? throw new Exception("Post not found");
            await _postRepository.DeletePostForeverAsync(post);
        }

        public async Task RestorePostFromTrash(long id, string username)
        {
            var post = await _postRepository.GetPostByIdAsync(id, true)
                ?? throw new Exception("Post not found");
            if (post.Creater.UserName != username)
                throw new Exception("Not the author of the post");
            await _postRepository.RestorePostFromTrashAsync(post);
        }

        public async Task EditPost(long id, EditPostDTO postDTO)
        {
            var post = await _postRepository.GetPostByIdAsync(id)
                ?? throw new Exception("Post not found");
            await _postRepository.EditPostAsync(post, postDTO);

        }
    }
}
