using System.Security.Claims;
using AutoMapper;
using FStudyForum.Core.Models.DTOs.Token;
using FStudyForum.Core.Models.DTOs.User;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using Microsoft.AspNetCore.Identity;
using FStudyForum.Core.Models.DTOs.Auth;
using FStudyForum.Core.Exceptions;
using FStudyForum.Core.Helpers;
using FStudyForum.Infrastructure.Repositories;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Topic;
using FStudyForum.Core.Models.DTOs.Search;
using FStudyForum.Core.Models.DTOs.Profile;
namespace FStudyForum.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IUserRepository _userRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly IMapper _mapper;

    public UserService(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        IUserRepository userRepository,
        IMapper mapper,
        IProfileRepository profileRepository
    )
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _userRepository = userRepository;
        _mapper = mapper;
        _profileRepository = profileRepository;
    }


    private async Task<TokenDTO> CreateAuthTokenAsync(ApplicationUser user, int expDays = -1)
    {
        user.RefreshToken = _tokenService.GenerateRefreshToken();
        if (expDays > 0)
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(expDays);
        await _userManager.UpdateAsync(user);
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.UserName??string.Empty),
            new(ClaimTypes.Email, user.Email??string.Empty)
        };
        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
            claims.Add(new Claim(ClaimTypes.Role, role));
        return new TokenDTO()
        {
            AccessToken = _tokenService.GenerateAccessToken(claims),
            RefreshToken = user.RefreshToken
        };
    }

    public async Task<TokenDTO> CreateAuthTokenAsync(string userName, int expDays = -1)
    {
        var user = await _userManager.FindByNameAsync(userName)
            ?? throw new Exception("UserName is invalid");
        return await CreateAuthTokenAsync(user, expDays);
    }
    public async Task<TokenDTO> RefeshAuthTokenAsync(string refeshToken)
    {
        var user = await _userRepository.FindUserByRefreshTokenAsync(refeshToken);
        if (user is null || user.RefreshTokenExpiryTime <= DateTime.Now)
            throw new Exception("Invalid access token or refresh token");
        return await CreateAuthTokenAsync(user);
    }

    public async Task<UserDTO> GetProfileByName(string username)
    {
        var user = await _userManager.FindByNameAsync(username)
            ?? throw new Exception("UserName is invalid");

        return await GetProfileByUser(user);
    }

    private async Task<UserDTO> GetProfileByUser(ApplicationUser user)
    {
        var profile = await _profileRepository.GetByName(user.UserName!);
        return new UserDTO
        {
            Username = user.UserName!,
            Email = user.Email!,
            Roles = await _userManager.GetRolesAsync(user),
            Mods = (await _userRepository.GetModeratedTopics(user.UserName!)).Select(topic => new TopicDTO
                {
                    Id = topic.Id,
                    Name = topic.Name,
                    Description = topic.Description,
                    Avatar = topic.Avatar,
                    Banner = topic.Panner,
                    Categories = topic.Categories.Select(c => c.Id).ToList()
                }),
            Avatar = profile?.Avatar ?? string.Empty
        };
    }


    public async Task<UserDTO?> FindOrCreateUserAsync(ExternalAuthDTO externalAuth, List<string> roles)
    {
        var payload = await _tokenService.VerifyGoogleToken(externalAuth);
        if (payload == null || !EmailHelper.IsFptMail(payload.Email)) throw new Exception("Email must be FPT email");
        var info = new UserLoginInfo(externalAuth.Provider, payload.Subject, externalAuth.Provider);
        var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
        if (user == null)
        {
            user = await _userManager.FindByEmailAsync(payload.Email);
            if (user == null)
            {
                user = new ApplicationUser { Email = payload.Email, UserName = EmailHelper.GetUsername(payload.Email), EmailConfirmed = true };
                await _userManager.CreateAsync(user);
                await _userManager.AddToRolesAsync(user, roles);
                await _userManager.AddLoginAsync(user, info);
            }
            else
                throw new Exception("Email already exists");
        }
        return user == null ? null : _mapper.Map<UserDTO>(user);
    }

    public async Task<bool> CheckEmailExistedAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        return user != null;
    }

    public async Task<string> GeneratePasswordResetTokenAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email) ?? throw new NotFoundException("User not found");
        return await _userManager.GeneratePasswordResetTokenAsync(user);
    }

    public async Task<IdentityResult> ChangePasswordAsync(ChangePasswordDTO model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email) ?? throw new Exception("User not found");
        return await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
    }
    public async Task RemoveRefreshTokenAsync(string refreshToken)

    {
        var appUser = await _userRepository.FindUserByRefreshTokenAsync(refreshToken);
        if (appUser == null)
        {
            Console.WriteLine("User not found");
            return;
        }
        appUser.RefreshToken = "";
        await _userManager.UpdateAsync(appUser);
    }

    public async Task<string?> GetRefreshTokenAsync(string userName)
    {
        var user = await _userManager.FindByNameAsync(userName);
        return user?.RefreshToken;
    }

    public async Task<UserDTO> LockUser(LockUserDTO lockUserDTO)
    {
        if (string.IsNullOrEmpty(lockUserDTO.UserName) || lockUserDTO.LockoutDays <= 0)
            throw new Exception("Invalid input");
        var user = await _userManager.FindByNameAsync(lockUserDTO.UserName)
            ?? throw new Exception("User not found");
        var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.Now.AddDays(lockUserDTO.LockoutDays));
        if (result.Succeeded) throw new Exception("Lockout failed");
        return _mapper.Map<UserDTO>(user);

    }

    public async Task<UserDTO> UnlockUser(LockUserDTO lockUserDTO)
    {
        if (string.IsNullOrEmpty(lockUserDTO.UserName))
        {
            throw new Exception("Invalid input");
        }
        var user = await _userManager.FindByNameAsync(lockUserDTO.UserName)
            ?? throw new Exception("User not found");
        var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow);
        if (result.Succeeded)
        {
            return _mapper.Map<UserDTO>(user);
        }
        else
        {
            throw new Exception("Lockout failed");
        }
    }
    public async Task<bool> IsUserLocked(string userName)
    {
        var user = await _userManager.FindByNameAsync(userName)
            ?? throw new ApplicationException($"User '{userName}' not found.");
        return await _userManager.IsLockedOutAsync(user);
    }
    public async Task<DateTimeOffset?> GetUnlockTime(string userName)
    {
        var user = await _userManager.FindByNameAsync(userName)
            ?? throw new ApplicationException($"User '{userName}' not found.");
        return await _userManager.GetLockoutEndDateAsync(user);
    }
    public async Task<PaginatedData<UserDTO>> GetAll(QueryUserDTO query)
    {
        var users = await _userRepository.GetQuery(query);
        var totalCount = await _userRepository.CountAsync();

        var userDTOs = new List<UserDTO>();
        foreach (var user in users)
            userDTOs.Add(await GetProfileByUser(user));

        return new(userDTOs, totalCount);
    }

    public async Task<IEnumerable<UserDTO>> SearchUserByName(QuerySearchUserDTO query)
    {
        var users = await _userRepository.SearchUserByName(query);
        var userDTOs = new List<UserDTO>();
        if (users != null)
        {
            foreach (var user in users)
                userDTOs.Add(await GetProfileByUser(user));
        }
        return userDTOs;
    }

    public async Task<IEnumerable<ProfileDTO>> Search(string keyword, int size)
    {
        var users = await _userRepository.Search(keyword, size);
        var profileDTOs = new List<ProfileDTO>();
        if (users != null)
        {
            foreach (var user in users)
            {
                var profileDTO = _mapper.Map<ProfileDTO>(user.Profile);
                profileDTO.Username = user.UserName;
                profileDTO.PostCount = user.CreatedPosts.Count;
                profileDTO.CommentCount = user.Comments.Count;
                profileDTOs.Add(profileDTO);
            }
        }
        return profileDTOs;
    }

    public async Task<IEnumerable<UserStatisticsDTO>> GetUserStatisticsDTO(string action, int date)
    {
        DateTime startDate, endDate = DateTime.Now;
        switch (action)
        {
            case "day":
                startDate = endDate.AddDays(-date);
                break;
            case "lifetime":
                startDate = DateTime.MinValue;
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
        var users = await _profileRepository.GetStatisticsProfile(startDate, endDate);
        var groupedSthatistics = users.GroupBy(u => u.CreatedAt.Date)
            .Select(g => new UserStatisticsDTO
            {
                Date = DateOnly.FromDateTime(g.Key),
                TotalNumberRegistrants = g.Count()
            });
        var allDates = Enumerable.Range(0, (endDate.Date - startDate.Date).Days + 1)
                .Select(offset => startDate.Date.AddDays(offset))
                .ToList();
        var completeStatistics = allDates.Select(date =>
                groupedSthatistics.FirstOrDefault(stat => stat.Date == DateOnly.FromDateTime(date))
                ?? new UserStatisticsDTO
                {
                    Date = DateOnly.FromDateTime(date),
                    TotalNumberRegistrants = 0
                });
        return completeStatistics;
    }
}
