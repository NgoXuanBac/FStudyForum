using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Models.DTOs.Feed;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FStudyForum.Infrastructure.Repositories;

public class FeedRepository(ApplicationDBContext dbContext)
    : BaseRepository<Feed>(dbContext), IFeedRepository
{


    public async Task CreateFeed(ApplicationUser Creater, CreateFeedDTO createFeedDTO)
    {
        var feed = new Feed()
        {
            Name = createFeedDTO.Name,
            Description = createFeedDTO.Description,
            Creater = Creater,
        };
        await Create(feed);
    }

    public async Task<Feed?> GetFeed(string username, string feedName)
    {
        return await _dbContext.Feeds.Include(f => f.Creater).Include(f => f.Topics)
            .FirstOrDefaultAsync(f => f.Creater!.UserName == username && f.Name == feedName);
    }



}
