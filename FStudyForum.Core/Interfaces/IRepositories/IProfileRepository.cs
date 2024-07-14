using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Models.Entities;

namespace FStudyForum.Infrastructure.Repositories
{
    public interface IProfileRepository : IBaseRepository<Profile>
    {
        public Task<Profile?> GetByName(string username);
        public Task<IEnumerable<Profile>> GetStatisticsProfile(DateTime startDate, DateTime endDate);
    }
}
