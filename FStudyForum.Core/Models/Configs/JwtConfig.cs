namespace FStudyForum.Core.Models.Configs;

public class JwtConfig
{
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string SigningKey { get; set; } = string.Empty;
    public string AccessTokenKey { get; set; } = string.Empty;
    public string RefreshTokenKey { get; set; } = string.Empty;
    public int TokenValidityInMinutes { get; set; } = 5;
    public int RefreshTokenValidityInDays { get; set; } = 7;

}
