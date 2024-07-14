

namespace FStudyForum.Core.Models.DTOs.Donation
{
    public class DonationStatisticsDTO
    {
        public DateOnly Date { get; set; }
        public int TotalDonation { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
