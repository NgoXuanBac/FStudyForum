using FStudyForum.Core.Models.DTOs.Auth;

namespace FStudyForum.Core.Interfaces.IServices;

public interface IIdentityService
{
    Task<bool> CreateUserAsync(RegisterDTO registerDTO, List<string> roles, bool confirm = false);
    Task<bool> SigninUserAsync(LoginDTO loginDTO);
    Task<string> GetUserIdAsync(string userName);
    Task<string> GetUserNameAsync(string userId);
    Task<bool> DeleteUserAsync(string userId);
    Task<bool> IsUniqueUserName(string userName);
    Task<bool> CreateRoleAsync(string roleName);
    Task<bool> DeleteRoleAsync(string roleId);
    Task<List<(string id, string roleName)>> GetRolesAsync();
    Task<(string id, string roleName)> GetRoleByIdAsync(string id);
    Task<bool> UpdateRole(string id, string roleName);

    Task<bool> IsInRoleAsync(string userId, string role);
    Task<List<string>> GetUserRolesAsync(string userId);
    Task<bool> AssignUserToRole(string userName, IList<string> roles);

    Task<bool> UpdateUsersRole(string userName, IList<string> usersRole);
    Task<(bool isUserExists, bool isConfirmed)> CheckUserExistsWithEmailConfirmedAsync(string email);
    Task<string> GenerateEmailConfirmationTokenAsync(string email);
    Task<bool> ConfirmEmailAsync(string email, string token);
}
