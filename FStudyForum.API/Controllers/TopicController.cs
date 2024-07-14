using Microsoft.AspNetCore.Mvc;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Topic;
using FStudyForum.Core.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using FStudyForum.Core.Constants;


namespace FStudyForum.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicController : ControllerBase
    {
        private readonly ITopicService _topicService;

        public TopicController(ITopicService topicService)
        {
            _topicService = topicService;
        }
        [HttpGet("active-all")]
        public async Task<IActionResult> GetAllActiveTopics()
        {
            var activeTopics = await _topicService.GetActiveTopics();
            return Ok(activeTopics);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var topics = await _topicService.GetTopics();
            return Ok(new Response
            {
                Message = "Get all topic successfully",
                Status = ResponseStatus.SUCCESS,
                Data = topics
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? value, [FromQuery] int size = 5)
        {
            if (value == null) return BadRequest();

            var topics = await _topicService.Search(value, size);
            return Ok(new Response
            {
                Message = "Get all topic successfully",
                Status = ResponseStatus.SUCCESS,
                Data = topics
            });
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTopic([FromBody] CreateTopicDTO topicDto)
        {
            var createdTopic = await _topicService.CreateTopic(topicDto);
            return CreatedAtAction(nameof(GetTopicByName), new { name = createdTopic.Name }, createdTopic);
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetTopicByName(string name)
        {
            try
            {
                var topic = await _topicService.GetTopicByName(name);
                return Ok(new Response
                {
                    Message = "Get topic successfully",
                    Status = ResponseStatus.SUCCESS,
                    Data = topic
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
        [HttpPut("update/{name}")]
        public async Task<IActionResult> UpdateTopic(string name, [FromBody] UpdateTopicDTO topicDto)
        {
            try
            {
                var updatedTopic = await _topicService.UpdateTopic(name, topicDto);
                return Ok(updatedTopic);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut("delete/{name}"), Authorize(Roles = UserRole.Admin)]
        public async Task<IActionResult> DeleteTopic(string name)
        {
            var isDeleted = await _topicService.DeleteTopic(name);
            if (!isDeleted)
            {
                return NotFound();
            }
            return Ok("Topic deleted successfully");
        }

        [HttpGet("check-banned")]
        public async Task<IActionResult> CheckBanned([FromQuery] string username, [FromQuery] string topicName)
        {
            try
            {
                var topicBan = await _topicService.CheckBannedUser(username, topicName);
                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Check user banned successfully",
                    Data = topicBan
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
        [HttpPost("ban")]
        public async Task<IActionResult> BanUser([FromBody] CreateTopicBanDTO topicBanDTO)
        {
            try
            {
                var user = await _topicService.BanUser(topicBanDTO);
                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "User banned successfully",
                    Data = user
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
        [HttpPost("unban")]
        public async Task<IActionResult> UnbanUser(string username, string topicName)
        {
            try
            {
                await _topicService.UnbanUser(username, topicName);
                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "User unban successfully",
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
        [HttpGet("filter")]
        public async Task<IActionResult> GetTopicsByCategories([FromQuery] List<long> categoryIds)
        {
            if (categoryIds == null || !categoryIds.Any())
            {
                return BadRequest(new Response
                {
                    Message = "Category IDs must be provided.",
                    Status = ResponseStatus.ERROR
                });
            }

            var topics = await _topicService.GetTopicsByCategories(categoryIds);
            return Ok(new Response
            {
                Message = "Filtered topics successfully",
                Status = ResponseStatus.SUCCESS,
                Data = topics
            });
        }

    }
}
