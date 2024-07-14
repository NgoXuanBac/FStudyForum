using FStudyForum.Core.Models.DTOs.Donation;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Http;


namespace FStudyForum.Core.Interfaces.IServices
{
    public interface IPaymentService
    {
        Task<string> GeneratePaymentUrlAsync(VNPayPayment paymentData, HttpContext context);
       
        Task<VnPaymentResponse> PaymentResponse(IQueryCollection collections);
        Task<DonationDTO> SaveUserDonate(DonationDTO donationDTO);
    }
}
