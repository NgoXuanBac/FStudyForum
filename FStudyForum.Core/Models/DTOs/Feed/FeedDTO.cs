using FStudyForum.Core.Models.DTOs.Topic;

namespace FStudyForum.Core.Models.DTOs.Feed;

public class FeedDTO
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public virtual IEnumerable<TopicDTO> Topics { get; set; } = new List<TopicDTO>();
}
