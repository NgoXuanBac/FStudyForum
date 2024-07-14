namespace FStudyForum.Core.Constants;

public class Report
{
     public const string Spam = "Spam";
     public const string InappropriateContent = "Inappropriate Content";
     public const string HateSpeech = "Hate Speech";
     public const string Harassment = "Harassment";
     public const string Violence = "Violence";
     public const string Abuse = "Abuse";
     public const string IntellectualPropertyViolation = "Intellectual Property Violation";
     public const string Other = "Other";
     public static readonly string[] All = [
          Spam,
          InappropriateContent,
          HateSpeech,
          Harassment,
          Violence,
          Abuse,
          IntellectualPropertyViolation,
          Other
     ];
}