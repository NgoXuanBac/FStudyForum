using FStudyForum.Core.Models.DTOs.Search;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace FStudyForum.Core.Interfaces.IRepositories;

public interface IUserRepository : IBaseRepository<ApplicationUser>
{
    public Task<ApplicationUser?> FindUserByRefreshTokenAsync(string refreshToken);
    public Task<IEnumerable<ApplicationUser>> SearchUserByName(QuerySearchUserDTO query);
    public Task<IEnumerable<ApplicationUser>> Search(string keyword, int size);
    public Task<IEnumerable<Topic>> GetModeratedTopics(string username);
    public Task<IEnumerable<TopicBan>> GetBannedTopics(string username);

}
