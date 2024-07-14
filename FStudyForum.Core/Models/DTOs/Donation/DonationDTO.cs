

namespace FStudyForum.Core.Models.DTOs.Donation
{
    public class DonationDTO
    {
        public int ID { get; set; }
        public decimal Amount { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Tid { get; set; } 
    }
    public class CreateDonationDTO
    {
        public decimal Amount { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Tid { get; set; }
    }
    public class UpdateDonationDTO
    {
        public decimal Amount { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Tid { get; set; }
    }
}
