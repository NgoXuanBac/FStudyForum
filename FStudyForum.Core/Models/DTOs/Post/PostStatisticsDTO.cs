namespace FStudyForum.Core.Models.DTOs.Post
{
    public class PostStatisticsDTO
    {
        public DateOnly Date { get; set; }
        public int TotalPosts { get; set; }
        public int TotalComments { get; set; }
        public int TotalVotes { get; set; }
    }
}
