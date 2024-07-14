using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FStudyForum.Infrastructure.Repositories
{
    public class ProfileRepository(ApplicationDBContext dbContext)
        : BaseRepository<Profile>(dbContext), IProfileRepository
    {
        public new async Task<Profile> GetById<Tid>(Tid id)
        {
            var profile = await _dbContext.Profiles.Where(u => u.Id.Equals(id)).FirstOrDefaultAsync()
                ?? throw new Exception("User not found");
            return profile;
        }
        public async Task<Profile?> GetByName(string username)
        {
            var profile = await _dbContext.Profiles
                           .Include(u => u.User)
                           .Include(u => u.User.CreatedPosts)
                           .Include(u => u.User.Comments)
                           .Where(u => u.User.UserName!.Equals(username))
                           .FirstOrDefaultAsync();
            return profile;
        }
        public new async Task Update(Profile model)
        {
            _dbContext.Profiles.Update(model);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<IEnumerable<Profile>> GetStatisticsProfile(DateTime startDate, DateTime endDate)
        {
            var profiles = await _dbContext.Profiles
                           .Include(u => u.User)
                           .Where(u => u.CreatedAt >= startDate && u.CreatedAt <= endDate)
                           .ToListAsync();
            return profiles;
        }
    }
}
