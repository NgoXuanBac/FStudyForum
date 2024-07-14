using System.Security.Claims;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using FStudyForum.Core.Models.DTOs.Topic;

using System.Net;

namespace FStudyForum.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet("all"), Authorize]
        public async Task<IActionResult> GetPosts([FromQuery] QueryPostDTO query)
        {
            try
            {
                var username = User.Identity?.Name
                    ?? throw new Exception("User is not authenticated!");
                var posts = await _postService.GetPosts(username, query);
                if (posts.IsNullOrEmpty())
                {
                    return NotFound(new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = "Posts not found",
                    });
                }
                else
                {
                    return Ok(new Response
                    {
                        Message = "Get Posts successfully",
                        Status = ResponseStatus.SUCCESS,
                        Data = posts
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }


        [HttpGet("{id}"), Authorize]
        public async Task<IActionResult> GetPost([FromRoute] long id)
        {
            try
            {
                var userName = User.Identity?.Name ?? throw new Exception("User is not authenticated!");
                var post = await _postService.GetPostById(id, userName);
                if (post == null)
                {
                    return NotFound(new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = "Post not found",
                    });
                }
                return Ok(new Response
                {
                    Message = "Get Post successfully",
                    Status = ResponseStatus.SUCCESS,
                    Data = post
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("move-trash/{id}"), Authorize]
        public async Task<IActionResult> MovePostToTrash([FromRoute] long id)
        {
            try
            {
                var userName = User.Identity?.Name
                    ?? throw new Exception("User is not authenticated!");
                await _postService.MovePostToTrash(id, userName);

                return Ok(new Response
                {
                    Message = "Move post to trash successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("restore-trash/{id}"), Authorize]
        public async Task<IActionResult> RestorePostFromTrash([FromRoute] long id)
        {
            try
            {
                var userName = User.Identity?.Name
                    ?? throw new Exception("User is not authenticated!");
                await _postService.RestorePostFromTrash(id, userName);

                return Ok(new Response
                {
                    Message = "Move post to trash successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpDelete("delete/{id}"), Authorize]
        public async Task<IActionResult> DeletePost([FromRoute] long id)
        {
            try
            {
                var userName = User.Identity?.Name
                    ?? throw new Exception("User is not authenticated!");
                await _postService.DeletePost(id, userName);
                return Ok(new Response
                {
                    Message = "Delete Post successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpPost("create"), Authorize]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDTO postDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var userName = User.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("User is not authenticated!");
                postDto.Author = userName;
                var post = await _postService.CreatePost(postDto);

                return Ok(new Response
                {
                    Message = "Create post successfully",
                    Status = ResponseStatus.SUCCESS,
                    Data = post
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

        [HttpPatch("edit/{postId}"), Authorize]
        public async Task<IActionResult> EditPost([FromRoute] long postId, [FromBody] EditPostDTO postDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                await _postService.EditPost(postId, postDTO);

                return Ok(new Response
                {
                    Message = "Edit post successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("recent/{postID}"), Authorize]
        public async Task<IActionResult> AddRecentPost([FromRoute] int postID)
        {
            try
            {
                var userName = User.FindFirstValue(ClaimTypes.Name)
                    ?? throw new Exception("User is not authenticated!");
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                    var responseNotFound = new Response
                    {
                        Status = (int)HttpStatusCode.BadRequest + "",
                        Message = string.Join("; ", errors)
                    };
                    return BadRequest(responseNotFound);
                }
                var recentPost = await _postService.AddRecentPostByUser(new() { PostId = postID, UserName = userName });
                if (recentPost == null)
                {
                    return NotFound(new Response
                    {
                        Data = recentPost,
                        Message = "User is not found.",
                        Status = (int)HttpStatusCode.NotFound + ""
                    });
                }
                return Ok(new Response
                {
                    Data = recentPost,
                    Message = "Post added to recent",
                    Status = (int)HttpStatusCode.OK + "",
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

        [HttpGet("recent"), Authorize]
        public async Task<IActionResult> GetAllRecentPosts()
        {
            try
            {
                var userName = User.FindFirstValue(ClaimTypes.Name)
                    ?? throw new Exception("User is not authenticated!");
                var posts = await _postService.GetRecentPostsByUser(userName);

                return Ok(new Response
                {
                    Message = "Get Posts successfully",
                    Status = ResponseStatus.SUCCESS,
                    Data = posts ?? []
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

        [HttpDelete("clear-recent"), Authorize]
        public async Task<IActionResult> ClearRecentPosts()
        {
            try
            {
                var userName = User.FindFirstValue(ClaimTypes.Name)
                    ?? throw new Exception("User is not authenticated!");
                await _postService.ClearRecentPostsByUser(userName);
                return Ok(new Response
                {
                    Message = "Get Posts successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("save/{postID}"), Authorize]
        public async Task<IActionResult> SavePost([FromRoute] int postID)
        {
            try
            {
                var userName = User.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("User is not authenticated!");
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                    var responseNotFound = new Response
                    {
                        Status = (int)HttpStatusCode.BadRequest + "",
                        Message = string.Join("; ", errors)
                    };
                    return BadRequest(responseNotFound);
                }
                var savePost = await _postService.SavePostByUser(new() { PostId = postID, UserName = userName });
                if (savePost == null)
                {
                    return NotFound(new Response
                    {
                        Data = savePost,
                        Message = "User is not found.",
                        Status = (int)HttpStatusCode.NotFound + ""
                    });
                }
                return Ok(new Response
                {
                    Data = savePost,
                    Message = "Post saved",
                    Status = (int)HttpStatusCode.OK + "",
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpDelete("remove-save/{postID}"), Authorize]
        public async Task<IActionResult> RemoveSavedPost([FromRoute] int postID)
        {
            try
            {
                var userName = User.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("User is not authenticated!");

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                    var responseNotFound = new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = string.Join("; ", errors)
                    };
                    return BadRequest(responseNotFound);
                }
                var post = await _postService.RemoveFromSavedByUser(new() { PostId = postID, UserName = userName });
                if (post == null)
                {
                    return NotFound(new Response
                    {
                        Data = post,
                        Message = "User is not found.",
                        Status = ResponseStatus.ERROR
                    });
                }
                return Ok(new Response
                {
                    Data = post,
                    Message = "Removed from saved",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpGet("saved/{username}/{postId}")]
        public async Task<IActionResult> IsPostExists(string username, int postId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                               .Select(e => e.ErrorMessage)
                               .ToList();
                    var responseNotFound = new Response
                    {
                        Status = (int)HttpStatusCode.BadRequest + "",
                        Message = string.Join("; ", errors)
                    };
                    return BadRequest(responseNotFound);
                }
                var isPostExists = await _postService.IsPostSaved(new SavePostDTO()
                { UserName = username, PostId = postId });
                return Ok(new Response
                {
                    Data = !isPostExists,
                    Message = "Post is exists",
                    Status = (int)HttpStatusCode.OK + "",
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpGet("saved-all/{username}")]
        public async Task<IActionResult> GetSavedPostsByUser(string username)
        {
            try
            {
                var posts = await _postService.GetSavedPostsByUser(username);
                if (posts.IsNullOrEmpty())
                {
                    return NotFound(new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = "Posts not found",
                        Data = posts
                    });
                }
                return Ok(new Response
                {
                    Message = "Get Posts successfully",
                    Status = ResponseStatus.SUCCESS,
                    Data = posts
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }
        [HttpGet("statistics={action}&date={date}")]
        public async Task<IActionResult> GetPostStatics(string action, int date)
        {
            try
            {
                var postStatistics = await _postService.GetPostStatisticsDTO(action, date);

                return Ok(new Response
                {
                    Data = postStatistics,
                    Message = "Get post statistics successfully",
                    Status = ResponseStatus.SUCCESS
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message
                });
            }
        }

    }
}
