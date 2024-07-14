using AutoMapper;
using FStudyForum.Core.Helpers;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Donation;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace FStudyForum.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly IDonationRepository _donationRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        public PaymentService(IConfiguration configuration, IDonationRepository donationRepository
            , IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _configuration = configuration;
            _donationRepository = donationRepository;
            _mapper = mapper;
            _userManager = userManager;
        }
        public Task<string> GeneratePaymentUrlAsync(VNPayPayment paymentData, HttpContext context)
        {
            var tick = DateTime.Now.Ticks.ToString();
            var vnpay = new PaymentHepler();
            vnpay.AddRequestData("vnp_Version", _configuration["VnPay:Version"] ?? 
                throw new Exception("Version not valid."));
            vnpay.AddRequestData("vnp_Command", _configuration["VnPay:Command"] ??
                throw new Exception("Command not valid."));
            vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"] ??
                throw new Exception("TmnCode not valid."));
            vnpay.AddRequestData("vnp_Amount", (paymentData.Amount * 100).ToString());           
            vnpay.AddRequestData("vnp_CreateDate", paymentData.CreateDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _configuration["VnPay:CurrCode"] ??
                throw new Exception("CurrCode not valid."));
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", _configuration["VnPay:Locale"] ??
                throw new Exception("Locale not valid."));

            vnpay.AddRequestData("vnp_OrderInfo", paymentData.Username);
            vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other
            vnpay.AddRequestData("vnp_ReturnUrl", _configuration["VnPay:PaymentBackReturnUrl"] ??
                throw new Exception("PaymentBackReturnUrl not valid."));

            vnpay.AddRequestData("vnp_TxnRef", tick);
            // Thêm các tham số khác nếu cần
            var paymentUrl = vnpay.CreateRequestUrl(_configuration["VnPay:BaseUrl"] ?? throw new Exception("BaseUrl not valid."),
                _configuration["VnPay:HashSecret"] ?? throw new Exception("HashSecret not valid.")
               ) ;
            return Task.FromResult(paymentUrl);
        }

        public Task<VnPaymentResponse> PaymentResponse(IQueryCollection collections)
        {
            var vnpay = new PaymentHepler();
            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_orderId = Convert.ToInt64(vnpay.GetResponseData("vnp_TxnRef"));
            var vnp_TransactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            var  vnp_SecureHash = collections?.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
          
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");
            var vnp_Amount = Convert.ToDecimal(vnpay.GetResponseData("vnp_Amount")) / 100;
            #pragma warning disable CS8604 
            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash , _configuration["VnPay:HashSecret"]
                ?? throw new Exception("HashSecret not valid.")
               );
           
            if (!checkSignature)
            {
                return Task.FromResult(new VnPaymentResponse
                {
                    Success = false
                });
            }
            #pragma warning disable CS8601 
            return Task.FromResult(new VnPaymentResponse
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription = vnp_OrderInfo,
                OrderId = vnp_orderId.ToString(),
                TransactionId = vnp_TransactionId.ToString(),
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode,
                 Amount = vnp_Amount
            });
            #pragma warning restore CS8601 
        }
        public async Task<DonationDTO> SaveUserDonate(DonationDTO donationDTO)
        {
            var user = await _userManager.FindByNameAsync(donationDTO.Username)
                ?? throw new Exception("User not found");   
            var donation = _mapper.Map<Donation>(donationDTO);
            donation.User = user;
            await _donationRepository.SaveUserDonate(donation);
            return _mapper.Map<DonationDTO>(donation);
        }
    }
}

