using FStudyForum.Core.Constants;

namespace FStudyForum.Core.Models.DTOs.Post;

public class QueryPostDTO : QueryParameters
{
    public string? Filter { get; set; }
    public string? Keyword { get; set; }
    public string? Topic { get; set; }
    public string? User { get; set; }
    public PostType Type { get; set; } = PostType.IN_TOPIC;
    public QueryPostDTO()
    {
        OrderBy = "CreatedAt";
    }
}
