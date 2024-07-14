using FStudyForum.Core.Models.DTOs.Profile;

namespace FStudyForum.Core.Interfaces.IServices;

public interface IProfileService
{
    public Task<ProfileDTO> Insert(ProfileDTO profileDto, string username);
    public Task<ProfileDTO?> UpdateProfile(ProfileDTO profileDTO, string username);
    public Task<ProfileDTO?> GetByName(string username);
}
