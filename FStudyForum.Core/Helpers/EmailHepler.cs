using System.Net.Mail;
using System.Text.RegularExpressions;

namespace FStudyForum.Core.Helpers;

public static class EmailHelper
{
    public static bool IsFptMail(string email)
    {
        string pattern = @"^[^\s@]+@fpt\.edu\.vn$";
        Regex emailRegex = new(pattern);
        return emailRegex.IsMatch(email);
    }

    public static string GetUsername(string email)
    {
        var address = new MailAddress(email);
        return address.User;
    }
}
