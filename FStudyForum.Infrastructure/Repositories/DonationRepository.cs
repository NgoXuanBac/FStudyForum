using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FStudyForum.Infrastructure.Repositories
{
    public class DonationRepository : BaseRepository<Donation>, IDonationRepository
    {
        public DonationRepository(ApplicationDBContext dbContext) : base(dbContext)
        {
        }

        public async Task SaveUserDonate(Donation donation)
        {
            await _dbContext.Donations.AddAsync(donation);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<Donation?> GetDonationByTid(string tid)
        {
            return await _dbContext.Donations.FirstOrDefaultAsync(d => d.Tid == tid);
        }
        public async Task<Donation?> GetDonationByUser(string username)
        {
            var donationByUser = await _dbContext.Donations.Where(d => d.User.UserName!.Equals(username))
                .OrderByDescending(d => d.Id).FirstOrDefaultAsync();
            return donationByUser;
        }
        
        public async Task DeleteUserDonation(Donation donation)
        {
            _dbContext.Donations.Remove(donation);
            await _dbContext.SaveChangesAsync();
        }
        public async Task<IEnumerable<Donation>> GetStatisticsDonations(DateTime startDate, DateTime endDate)
        {
            return await _dbContext.Donations.Where(d => d.CreatedAt >= startDate
            && d.CreatedAt <= endDate && d.Tid != null).ToListAsync();
        }       
    }
}
