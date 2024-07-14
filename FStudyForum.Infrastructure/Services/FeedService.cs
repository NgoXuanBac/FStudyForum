using AutoMapper;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Feed;
using FStudyForum.Core.Models.DTOs.Topic;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace FStudyForum.Infrastructure.Services;

public class FeedService : IFeedService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IFeedRepository _feedRepository;
    private readonly ITopicRepository _topicRepository;
    private readonly IMapper _mapper;
    public FeedService(UserManager<ApplicationUser> userManager,
        IFeedRepository feedRepository,
        IMapper mapper, ITopicRepository topicRepository)
    {
        _userManager = userManager;
        _feedRepository = feedRepository;
        _mapper = mapper;
        _topicRepository = topicRepository;

    }

    public async Task AddTopicToFeed(string username, AddFeedDTO addFeedDTO)
    {
        var feed = await _feedRepository.GetFeed(username, addFeedDTO.FeedName)
             ?? throw new Exception("Feed not found");
        var topic = await _topicRepository.GetByName(addFeedDTO.TopicName)
            ?? throw new Exception("Topic not found");
        if (feed.Topics.FirstOrDefault(topic) != null) throw new Exception("Topic is existed in feed");
        feed.Topics.Add(topic);
        await _feedRepository.Update(feed);
    }

    public async Task CreateFeed(string username, CreateFeedDTO createFeedDTO)
    {
        var feed = await _feedRepository.GetFeed(username, createFeedDTO.Name);
        if (feed != null) throw new Exception("Feed is existed");
        var creater = await _userManager.FindByNameAsync(username)
            ?? throw new Exception("User not found");
        await _feedRepository.CreateFeed(creater, createFeedDTO);
    }

    public async Task DeleteFeed(string username, string feedName)
    {
        var feed = await _feedRepository.GetFeed(username, feedName)
            ?? throw new Exception("Feed not found");
        await _feedRepository.Delete(feed);
    }

    public async Task<FeedDTO> GetFeed(string username, string feedName)
    {
        var feed = await _feedRepository.GetFeed(username, feedName)
            ?? throw new Exception("Feed not found");
        return new FeedDTO()
        {
            Name = feed.Name,
            Description = feed.Description,
            Topics = _mapper.Map<TopicDTO[]>(feed.Topics)
        };
    }

    public async Task RemoveTopicFromFeed(string username, RemoveFeedDTO removeFeedDTO)
    {
        var feed = await _feedRepository.GetFeed(username, removeFeedDTO.FeedName)
              ?? throw new Exception("Feed not found");
        var topic = feed.Topics.FirstOrDefault(t => t.Name == removeFeedDTO.TopicName)
            ?? throw new Exception("Topic isn't existed in feed");
        feed.Topics.Remove(topic);
        await _feedRepository.Update(feed);
    }
}
