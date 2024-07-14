using FStudyForum.Core.Constants;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Auth;
using FStudyForum.Core.Models.DTOs.Token;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.Configs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using FStudyForum.Core.Helpers;
using Microsoft.AspNetCore.Authentication;
using FStudyForum.Core.Models.DTOs.Topic;

namespace FStudyForum.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly JwtConfig _jwtConfig;
    private readonly IUserService _userService;
    private readonly IIdentityService _identityService;
    private readonly IEmailService _emailService;


    public AuthController(
        IOptions<JwtConfig> jwtConfig,
        IUserService accountService,
        IIdentityService identityService,
        IEmailService emailService)
    {
        _jwtConfig = jwtConfig.Value;
        _userService = accountService;
        _identityService = identityService;
        _emailService = emailService;

    }


    [HttpPost("login")]
    public async Task<IActionResult> Authenticate([FromBody] LoginDTO loginDTO)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        try
        {
            var isValid = await _identityService.SigninUserAsync(loginDTO);
            if (!isValid) throw new Exception("Email or password is incorrect");
            var tokenDTO = await _userService
                .CreateAuthTokenAsync(EmailHelper.GetUsername(loginDTO.Email), _jwtConfig.RefreshTokenValidityInDays);
            SetTokensInsideCookie(tokenDTO, HttpContext);

            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Login successfully"
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

    [HttpPost("login-google")]
    public async Task<IActionResult> GoogleAuthenticate(ExternalAuthDTO externalAuth)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var user = await _userService.FindOrCreateUserAsync(externalAuth, [UserRole.User]);
            if (user != null)
            {
                var tokenDTO = await _userService
                    .CreateAuthTokenAsync(user.Username, _jwtConfig.RefreshTokenValidityInDays);
                SetTokensInsideCookie(tokenDTO, HttpContext);

                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Login successfully"
                });
            }
            else throw new Exception("Invalid external authentication");
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

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var userName = (HttpContext.User?.Identity?.Name) ?? throw new Exception("User is not authenticated!");
            var refreshToken = await _userService.GetRefreshTokenAsync(userName) ?? throw new Exception("Not found refresh token!");
            await _userService.RemoveRefreshTokenAsync(refreshToken);
            RemoveTokensInsideCookie(HttpContext);
            await HttpContext.SignOutAsync();
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Logout successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new Response
            {
                Status = ResponseStatus.ERROR,
                Message = $"Logout failed! Error: {ex.Message}"
            });
        }
    }

    [HttpGet("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            var refeshToken = GetTokenInsideCookie(_jwtConfig.RefreshTokenKey, HttpContext);
            var tokenDTO = await _userService.RefeshAuthTokenAsync(refeshToken);
            SetTokensInsideCookie(tokenDTO, HttpContext);
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Refresh Token Successfully!"
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

    private static string GetTokenInsideCookie(string tokenKey, HttpContext context)
    {
        context.Request.Cookies.TryGetValue(tokenKey, out var refreshToken);
        if (refreshToken is null)
            throw new Exception("Not found refresh token!");
        return refreshToken;
    }

    private void SetTokensInsideCookie(TokenDTO tokenDTO, HttpContext context)
    {

        context.Response.Cookies.Append(_jwtConfig.AccessTokenKey, tokenDTO.AccessToken,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtConfig.TokenValidityInMinutes),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });
        const string refreshTokenPath = "/api/auth/refresh-token";
        context.Response.Cookies.Append(_jwtConfig.RefreshTokenKey, tokenDTO.RefreshToken,
            new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(_jwtConfig.RefreshTokenValidityInDays),
                HttpOnly = true,
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = refreshTokenPath,
            });
    }

    private void RemoveTokensInsideCookie(HttpContext context)
    {

        context.Response.Cookies.Append(_jwtConfig.AccessTokenKey, "", new CookieOptions
        {
            HttpOnly = false,
            Expires = DateTimeOffset.UtcNow.AddDays(-1)
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO model)
    {
        var isExisted = await _userService.CheckEmailExistedAsync(model.Email);
        if (!isExisted) return BadRequest(new Response
        {
            Status = ResponseStatus.ERROR,
            Message = "We cannot find your email"
        });
        var token = await _userService.GeneratePasswordResetTokenAsync(model.Email);
        var resetLink = $"http://localhost:3000/auth/reset-password/change-password?token={token}&email={model.Email}";
        var emailContent = $@"
        <p>Please click the link below to reset your password:</p>
        <p><a href='{resetLink}'>Reset Password</a></p>";
        await _emailService.SendEmailAsync(model.Email, "Reset Password", emailContent);

        return Ok(new Response
        {
            Status = ResponseStatus.SUCCESS,
            Message = "Send mail successfully"
        });
    }


    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDTO)
    {
        try
        {
            var result = await _userService.ChangePasswordAsync(changePasswordDTO);
            if (!result.Succeeded) throw new Exception();
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Change password successfully"
            });
        }
        catch (Exception)
        {
            return BadRequest(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Email or token is invalid"
            });
        }
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (!EmailHelper.IsFptMail(registerDTO.Email))
        {
            return BadRequest(new Response
            {
                Status = ResponseStatus.ERROR,
                Message = "Email must be FPT email"
            });
        }
        var (isUserExists, isConfirmed) = await _identityService.CheckUserExistsWithEmailConfirmedAsync(registerDTO.Email);
        if (isUserExists && isConfirmed)

        {
            return BadRequest(new Response
            {
                Status = ResponseStatus.ERROR,
                Message = "Email already exists"
            });
        }
        if (isUserExists && !isConfirmed)
        {
            var userId = await _identityService.GetUserIdAsync(registerDTO.Email);
            var result = await _identityService.DeleteUserAsync(userId);
            if (!result)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = "An error occurred while deleting the existing user"
                });
            }
        }
        var isSucceed = await _identityService.CreateUserAsync(registerDTO, [UserRole.User]);
        if (!isSucceed)
        {
            return StatusCode(500, new Response
            {
                Status = ResponseStatus.ERROR,
                Message = "An error occurred while creating the user"
            });
        }

        var token = await SendConfirmationEmailAsync(registerDTO.Email);

        return Ok(new Response
        {
            Status = ResponseStatus.SUCCESS,
            Message = "Registration successful, please check your email to confirm your account",
            Data = token
        });
    }

    [HttpPost("resend-confirm-email")]
    public async Task<IActionResult> ResendConfirmationEmail([FromQuery] string email)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userExists = await _userService.CheckEmailExistedAsync(email);
        if (!userExists)
        {
            return BadRequest(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "User does not exist"
            });
        }

        var token = await SendConfirmationEmailAsync(email);

        return Ok(new Response
        {
            Status = ResponseStatus.SUCCESS,
            Message = "Confirmation email resent, please check your email to confirm your account",
            Data = token
        });
    }

    private async Task<string> SendConfirmationEmailAsync(string email)
    {
        var token = await _identityService.GenerateEmailConfirmationTokenAsync(email);
        var confirmationLink = Url.Action(nameof(ConfirmEmail), "auth", new { token, email, action = "register" }, Request.Scheme);
        var emailContent =
            $@"<p>Dear user, {email}</p>
            <p>Welcome to FStudy!</p>
            <p>Thank you for registering. Please confirm your email by follow the link below:</p>
            <p><a href='{confirmationLink}'>Confirm Email</a></p>";

        await _emailService.SendEmailAsync(email, "Confirm your email", emailContent);
        return token;
    }

    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] string token, [FromQuery] string email)
    {
        try
        {
            var result = await _identityService.ConfirmEmailAsync(email, token);
            if (!result) throw new Exception("Email or token invalid");
            return Redirect(_jwtConfig.Audience + "/auth/signin");
            // return Ok(new Response
            // {
            //     Status = ResponseStatus.SUCCESS,
            //     Message = "Confirm email successfully"
            // });
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
    [HttpPost("locked")]
    public async Task<IActionResult> LockUser([FromBody] LockUserDTO lockUserDTO)
    {
        try
        {
            var result = await _userService.LockUser(lockUserDTO);
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Lock user successfully",
                Data = result
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
    [HttpPost("unlocked")]
    public async Task<IActionResult> UnlockUser([FromBody] LockUserDTO lockUserDTO)
    {
        try
        {
            var result = await _userService.UnlockUser(lockUserDTO);
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Unlock user successfully",
                Data = result
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
    [HttpGet("{userName}/is-locked")]
    public async Task<IActionResult> IsUserLocked(string userName)
    {
        try
        {
            var result = await _userService.IsUserLocked(userName);
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = result ? "Check user locked successfully" : "Check user not locked successfully",
                Data = result
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
    [HttpGet("{userName}/unlock-time")]
    public async Task<IActionResult> GetUnlockTime(string userName)
    {
        try
        {
            var unlockTime = await _userService.GetUnlockTime(userName);
            if (unlockTime.HasValue)
            {
                return Ok(unlockTime.Value);
            }
            else
            {
                return Ok("User is not locked.");
            }
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}