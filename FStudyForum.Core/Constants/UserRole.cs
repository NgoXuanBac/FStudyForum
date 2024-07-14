namespace FStudyForum.Core.Constants;

public static class UserRole
{
    public const string Admin = "Admin";
    public const string Moderator = "Moderator";
    public const string User = "User";
    public static readonly string[] All = [Admin, User, Moderator];
}
