using FStudyForum.Core.Models.DTOs.Topic;
using FStudyForum.Core.Models.DTOs.Search;
using FStudyForum.Core.Models.Entities;

namespace FStudyForum.Core.Interfaces.IRepositories;

public interface ITopicRepository : IBaseRepository<Topic>
{
    public Task<List<Topic>> GetTopics();
    public Task<List<Topic>> Search(string value, int size);
    public Task<Topic?> GetByName(string name);
    public Task<bool> TopicExists(string topicName);
    public Task<TopicBan> BanUser(TopicBan topicBan);
    public Task<TopicBan> UnbanUser(TopicBan topicBan);
    public Task<TopicBan?> GetTopBan(string username, string topic);
    public Task<DateTimeOffset?> GetUnlockTime(CreateTopicBanDTO lockUser);
    public Task<IEnumerable<Topic>> SearchTopicContainKeywordAsync(QuerySearchTopicDTO query);
    public Task UpdateTopicBan(TopicBan topicBan);
    Task<IEnumerable<Topic>> GetTopicsByCategories(List<long> categoryIds);

}
