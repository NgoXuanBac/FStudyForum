using FStudyForum.Core.Models.Entities;


namespace FStudyForum.Core.Interfaces.IRepositories
{
    public interface IDonationRepository : IBaseRepository<Donation>
    {
        Task SaveUserDonate(Donation donation);
        Task<Donation?> GetDonationByTid(string tid);
        Task<Donation?> GetDonationByUser(string username);
        Task DeleteUserDonation(Donation donation);
        Task<IEnumerable<Donation>> GetStatisticsDonations(DateTime startDate, DateTime endDate);
    }
}
