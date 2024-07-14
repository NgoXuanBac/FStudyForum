using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.QRCode;
using System.Text;
using System.Text.Json;

namespace FStudyForum.Infrastructure.Services
{
    public class QRCodeService : IQRCodeService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IDonationRepository _donationRepository;
        
        public QRCodeService(IHttpClientFactory httpClientFactory
            , IDonationRepository donationRepository)
        {
            _httpClientFactory = httpClientFactory;
            _donationRepository = donationRepository;
        }

        public async Task<bool> CheckExistDonate(string tid)
        {
            return await _donationRepository.GetDonationByTid(tid) == null;
        }

        public async Task<QRCodeDTO?> GenerateVietQRCodeAsync(string amountByUser, string addInfoByUser)
        {
            var client = _httpClientFactory.CreateClient();
            var url = "https://api.vietqr.io/v2/generate";
            var requestBody = new
            {
                accountNo = long.Parse("50041234567890"),
                accountName = "Le Nhat Minh Khoi",
                acqId = Convert.ToInt32("970422"),
                amount = Convert.ToInt32(amountByUser),
                addInfo = addInfoByUser,
                format = "text",
                template = "compact2"
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(url, content);
            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                return JsonSerializer.Deserialize<QRCodeDTO>(responseData, options);
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Failed to generate VietQR: {errorContent}");
            }
        }
    }
}
