using FStudyForum.Core.Models.DTOs.Auth;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Core.Exceptions;
using FStudyForum.Core.Interfaces.IServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FStudyForum.Core.Helpers;


namespace FStudyForum.Infrastructure.Services;
public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _roleManager = roleManager;
    }

    public async Task<bool> AssignUserToRole(string userName, IList<string> roles)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == userName);
        if (user == null)
        {
            throw new NotFoundException("User not found");
        }

        var result = await _userManager.AddToRolesAsync(user, roles);
        return result.Succeeded;
    }

    public async Task<bool> CreateRoleAsync(string roleName)
    {
        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        if (!result.Succeeded)
        {
            throw new ValidationException(result.Errors);
        }
        return result.Succeeded;
    }

    public async Task<bool> CreateUserAsync(RegisterDTO registerDTO, List<string> roles, bool confirm = false)
    {
        var user = new ApplicationUser()
        {
            UserName = EmailHelper.GetUsername(registerDTO.Email),
            Email = registerDTO.Email,
            EmailConfirmed = confirm
        };

        var result = await _userManager.CreateAsync(user, registerDTO.Password);

        if (!result.Succeeded)
            throw new ValidationException(result.Errors);

        result = await _userManager.AddToRolesAsync(user, roles);

        if (!result.Succeeded)
            throw new ValidationException(result.Errors);
        return result.Succeeded;
    }

    public async Task<bool> DeleteRoleAsync(string roleId)
    {
        var roleDetails = await _roleManager.FindByIdAsync(roleId);
        if (roleDetails == null)
        {
            throw new NotFoundException("Role not found");
        }

        if (roleDetails.Name == "Administrator")
        {
            throw new BadRequestException("You can not delete Administrator Role");
        }
        var result = await _roleManager.DeleteAsync(roleDetails);
        if (!result.Succeeded)
        {
            throw new ValidationException(result.Errors);
        }
        return result.Succeeded;
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("User not found");
        }

        if (user.UserName == "system" || user.UserName == "admin")
        {
            throw new Exception("You can not delete system or admin user");
        }
        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }

    public async Task<List<(string id, string roleName)>> GetRolesAsync()
    {
        var roles = await _roleManager.Roles.Select(x => new
        {
            x.Id,
            x.Name
        }).ToListAsync();

        return roles.Select(role => (role.Id, role.Name ?? string.Empty)).ToList();
    }

    public async Task<string> GetUserIdAsync(string userName)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == userName);
        if (user == null)
        {
            throw new NotFoundException("User not found");
        }
        return await _userManager.GetUserIdAsync(user);
    }

    public async Task<string> GetUserNameAsync(string userId)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("User not found");
        }
        return await _userManager.GetUserNameAsync(user) ?? string.Empty;
    }

    public async Task<List<string>> GetUserRolesAsync(string userId)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId)
            ?? throw new NotFoundException("User not found");
        var roles = await _userManager.GetRolesAsync(user);
        return [.. roles];
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);

        if (user == null)
        {
            throw new NotFoundException("User not found");
        }
        return await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> IsUniqueUserName(string userName)
    {
        return await _userManager.FindByNameAsync(userName) == null;
    }

    public async Task<bool> SigninUserAsync(LoginDTO loginDTO)
    {
        var result = await _signInManager.PasswordSignInAsync(EmailHelper.GetUsername(loginDTO.Email), loginDTO.Password, true, false);
        return result.Succeeded;
    }

    public async Task<(string id, string roleName)> GetRoleByIdAsync(string id)
    {
        var role = await _roleManager.FindByIdAsync(id);
        return (role?.Id ?? string.Empty, role?.Name ?? string.Empty);
    }

    public async Task<bool> UpdateRole(string id, string roleName)
    {
        if (roleName != null)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null) return false;
            role.Name = roleName;
            var result = await _roleManager.UpdateAsync(role);
            return result.Succeeded;
        }
        return false;
    }

    public async Task<bool> UpdateUsersRole(string userName, IList<string> usersRole)
    {
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null) return false;
        var existingRoles = await _userManager.GetRolesAsync(user);
        var result = await _userManager.RemoveFromRolesAsync(user, existingRoles);
        result = await _userManager.AddToRolesAsync(user, usersRole);

        return result.Succeeded;
    }
    public async Task<(bool isUserExists, bool isConfirmed)> CheckUserExistsWithEmailConfirmedAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user != null)
        {
            return (true, user.EmailConfirmed);
        }
        return (false, false);
    }

    public async Task<string> GenerateEmailConfirmationTokenAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email)
            ?? throw new NotFoundException("User not found by email");
        return await _userManager.GenerateEmailConfirmationTokenAsync(user);
    }

    public async Task<bool> ConfirmEmailAsync(string email, string token)
    {
        var user = await _userManager.FindByEmailAsync(email)
            ?? throw new NotFoundException("User not found by email");
        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded;
    }
}