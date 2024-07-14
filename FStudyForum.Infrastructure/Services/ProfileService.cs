using AutoMapper;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Profile;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Profile = FStudyForum.Core.Models.Entities.Profile;

namespace FStudyForum.Infrastructure.Services;

public class ProfileService : IProfileService
{
    private readonly IProfileRepository _profileRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;

    public ProfileService(
        UserManager<ApplicationUser> userManager,
        IMapper mapper,
        IProfileRepository profileRepository)
    {
        _userManager = userManager;
        _mapper = mapper;
        _profileRepository = profileRepository;

    }

    public async Task<ProfileDTO?> GetByName(string username)
    {
        var profile = await _profileRepository.GetByName(username)
            ?? throw new Exception("Profile not found");
        var result = _mapper.Map<ProfileDTO>(profile);
        result.Username = username;
        result.PostCount = profile.User.CreatedPosts.Count;
        result.CommentCount = profile.User.Comments.Count;
        return result;
    }

    public async Task<ProfileDTO> Insert(ProfileDTO profileDTO, string username)
    {
        if (profileDTO == null)
            throw new Exception(nameof(profileDTO) + "is not valid");

        var appUser = await _userManager.FindByNameAsync(username)
            ?? throw new Exception("User not found");

        if (await NonDuplicated(appUser))
        {
            var profile = _mapper.Map<Profile>(profileDTO);
            profile.User = appUser;
            appUser.Profile = profile;
            await _userManager.UpdateAsync(appUser);

            var updatedProfileDto = _mapper.Map<ProfileDTO>(profile);
            return updatedProfileDto;
        }
        throw new Exception("User has already had a profile");
    }

    private async Task<bool> NonDuplicated(ApplicationUser appUser)
    {
        var user = await _userManager.Users
            .Include(u => u.Profile)
            .SingleOrDefaultAsync(u => u.UserName == appUser.UserName);
        return user?.Profile == null;
    }


    public async Task<ProfileDTO?> UpdateProfile(ProfileDTO profileDTO, string name)
    {
        var profile = await _profileRepository.GetByName(name);
        if (profile == null)
        {
            return null;
        }
        _mapper.Map(profileDTO, profile);
        await _profileRepository.Update(profile);
        return _mapper.Map<ProfileDTO>(profile);
    }
}
