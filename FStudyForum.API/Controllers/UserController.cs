using FStudyForum.Core.Exceptions;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Auth;
using FStudyForum.Core.Models.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FStudyForum.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;

        public UserController(IUserService userService,
            IIdentityService identityService
        )
        {
            _userService = userService;
            _identityService = identityService;

        }

        [HttpGet("profile"), Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userName = User.FindFirstValue(ClaimTypes.Name);
            if (userName == null) return Unauthorized(new Response
            {
                Status = ResponseStatus.ERROR,
                Message = "User is not authenticated!"
            });
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Get profile successfully!",
                Data = await _userService.GetProfileByName(userName)
            });
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryUserDTO query)
        {
            try
            {
                var users = await _userService.GetAll(query);
                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Get users successfully!",
                    Data = users
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Message,
                });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? keyword, [FromQuery] int size = 5)
        {
            if (keyword == null) return BadRequest();

            var profiles = await _userService.Search(keyword, size);
            return Ok(new Response
            {
                Message = "Search Users successfully",
                Status = ResponseStatus.SUCCESS,
                Data = profiles
            });
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO createUserDTO)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var isSucceed = await _identityService.CreateUserAsync(new RegisterDTO
                {
                    Email = createUserDTO.Username,
                    Password = createUserDTO.Password
                }, createUserDTO.Roles, true);

                if (!isSucceed) throw new Exception("Username is existed");
                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Create user successfully"
                });
            }
            catch (ValidationException ex)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = ex.Errors
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
        [HttpGet("statistics/{action}/{date}")]
        public async Task<IActionResult> GetStatisticsProfile(string action, int date)
        {
            try
            {
                var profiles = await _userService.GetUserStatisticsDTO(action, date);
                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Get statistics profile successfully!",
                    Data = profiles
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
