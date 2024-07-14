using FStudyForum.Core.Models.DTOs.Donation;
using FStudyForum.Core.Models.DTOs.QRCode;

namespace FStudyForum.Core.Interfaces.IServices
{
    public interface IDonateService
    {
        Task<QRCodeDTO?> GenerateVietQRCodeAsync(string amountByUser, string addInfoByUser);
        Task<DonationDTO> SaveUserDonate(CreateDonationDTO donationDTO);      
        Task<DonationDTO> GetDonationByUser(string username);
        Task<DonationDTO> UpdateDonate(long id, UpdateDonationDTO updateDonationDTO);
        Task<bool> CheckDonation(string username, int id, string message, decimal amount);
        Task DeleteUserDonation(string username);
        Task<IEnumerable<DonationStatisticsDTO>> GetStatisticsDonations(string action, int date);
    }
}
