using System.Security.Claims;
using FStudyForum.Core.Models.DTOs.Auth;
using Google.Apis.Auth;

namespace FStudyForum.Core.Interfaces.IServices;

public interface ITokenService
{
    string GenerateRefreshToken();
    string GenerateAccessToken(List<Claim> claims);
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(ExternalAuthDTO externalAuth);
}
