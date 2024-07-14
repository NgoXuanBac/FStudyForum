using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Feed;
using Microsoft.AspNetCore.Mvc;


namespace FStudyForum.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedController : ControllerBase
    {
        private readonly IFeedService _feedService;

        public FeedController(IFeedService feedService)
        {
            _feedService = feedService;
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetFeedByName(string name)
        {
            try
            {
                var username = User.Identity?.Name
                   ?? throw new Exception("User is not authenticated!");
                var feed = await _feedService.GetFeed(username, name);
                return Ok(new Response
                {
                    Message = "Get topic successfully",
                    Status = ResponseStatus.SUCCESS,
                    Data = feed
                });
            }
            catch (Exception ex)
            {
                return NotFound(new Response
                {
                    Message = ex.Message,
                    Status = ResponseStatus.ERROR,
                });
            }
        }
        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteFeedByName(string name)
        {
            try
            {
                var username = User.Identity?.Name
                   ?? throw new Exception("User is not authenticated!");
                await _feedService.DeleteFeed(username, name);
                return Ok(new Response
                {
                    Message = "Get topic successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Message = ex.Message,
                    Status = ResponseStatus.ERROR,
                });
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateFeed(CreateFeedDTO createFeedDTO)
        {
            try
            {
                var username = User.Identity?.Name
                   ?? throw new Exception("User is not authenticated!");
                await _feedService.CreateFeed(username, createFeedDTO);
                return Ok(new Response
                {
                    Message = "Get topic successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Message = ex.Message,
                    Status = ResponseStatus.ERROR,
                });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddTopicToFeed(AddFeedDTO addFeedDTO)
        {
            try
            {
                var username = User.Identity?.Name
                   ?? throw new Exception("User is not authenticated!");
                await _feedService.AddTopicToFeed(username, addFeedDTO);
                return Ok(new Response
                {
                    Message = "Get topic successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return NotFound(new Response
                {
                    Message = ex.Message,
                    Status = ResponseStatus.ERROR,
                });
            }
        }


        [HttpPost("remove")]
        public async Task<IActionResult> RemoveTopicFromFeed(RemoveFeedDTO removeFeedDTO)
        {
            try
            {
                var username = User.Identity?.Name
                   ?? throw new Exception("User is not authenticated!");
                await _feedService.RemoveTopicFromFeed(username, removeFeedDTO);
                return Ok(new Response
                {
                    Message = "Get topic successfully",
                    Status = ResponseStatus.SUCCESS,
                });
            }
            catch (Exception ex)
            {
                return NotFound(new Response
                {
                    Message = ex.Message,
                    Status = ResponseStatus.ERROR,
                });
            }
        }

    }
}
