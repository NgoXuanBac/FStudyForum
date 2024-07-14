namespace FStudyForum.Core.Models.DTOs.Topic;

public class TopicBanDTO
{
    public string TopicName { get; set; } = string.Empty;
    public DateTime BannedTime { get; set; }
}
