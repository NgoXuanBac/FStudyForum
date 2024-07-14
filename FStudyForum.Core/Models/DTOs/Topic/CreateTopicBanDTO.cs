namespace FStudyForum.Core.Models.DTOs.Topic
{
    public class CreateTopicBanDTO
    {
        public string UserName { get; set; } = string.Empty;
        public string TopicName { get; set; } = string.Empty;
        public int Time { get; set; }
    }

}
