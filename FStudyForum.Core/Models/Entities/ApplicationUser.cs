
using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Identity;

namespace FStudyForum.Core.Models.Entities;
public class ApplicationUser : IdentityUser
{
    [MaxLength(100)]
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime RefreshTokenExpiryTime { get; set; }
    public virtual Profile? Profile { get; set; }
    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();
    public virtual ICollection<SavedPost> SavedPosts { get; set; } = new List<SavedPost>();
    public virtual ICollection<RecentPost> RecentPosts { get; set; } = new List<RecentPost>();
    public virtual ICollection<Post> CreatedPosts { get; set; } = new List<Post>();
    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Topic> ModeratedTopics { get; set; } = new List<Topic>();
    public virtual ICollection<TopicBan> BannedByTopics { get; set; } = new List<TopicBan>();
    public virtual ICollection<Feed> Feeds { get; set; } = new List<Feed>();
}
