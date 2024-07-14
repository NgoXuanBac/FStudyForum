using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Donation;
using FStudyForum.Core.Models.DTOs.QRCode;
using System.Text.Json;
using System.Text;
using FStudyForum.Core.Models.Entities;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System;
using FStudyForum.Core.Constants;
namespace FStudyForum.Infrastructure.Services
{
    public class DonateService : IDonateService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IDonationRepository _donationRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        public DonateService(IHttpClientFactory httpClientFactory
                       , IDonationRepository donationRepository
                       , UserManager<ApplicationUser> userManager,
                       IMapper mapper)
        {
            _httpClientFactory = httpClientFactory;
            _donationRepository = donationRepository;
            _userManager = userManager;
            _mapper = mapper;
        }
        public async Task<QRCodeDTO?> GenerateVietQRCodeAsync(string amountByUser, string addInfoByUser)
        {
            var client = _httpClientFactory.CreateClient();
            var url = DonateBank.URL;
            var requestBody = new
            {
                accountNo = long.Parse(DonateBank.ACCOUNT_NO),
                accountName = DonateBank.ACCOUNT_NAME,
                acqId = Convert.ToInt32(DonateBank.ACQ_ID),
                amount = Convert.ToInt32(amountByUser),
                addInfo = addInfoByUser,
                format = DonateBank.FORMAT,
                template = DonateBank.TEMPLATE
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8,
                "application/json");
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

        public async Task<DonationDTO> SaveUserDonate(CreateDonationDTO donationDTO)
        {
            var user = await _userManager.FindByNameAsync(donationDTO.Username)
                ?? throw new Exception("User not found");
            var donation = _mapper.Map<Donation>(donationDTO);
            donation.User = user;
            await _donationRepository.SaveUserDonate(donation);
            return _mapper.Map<DonationDTO>(donation);
        }

        public async Task<DonationDTO> GetDonationByUser(string username)
        {
            var donationByUser = await _donationRepository.GetDonationByUser(username)
                ?? throw new Exception("Not found.");
            return _mapper.Map<DonationDTO>(donationByUser);
        }
        public async Task<DonationDTO> UpdateDonate(long id, UpdateDonationDTO updateDonationDTO)
        {
            var donation = await _donationRepository.GetById(id)
                ?? throw new Exception("Not found.");           
            _mapper.Map(updateDonationDTO, donation);
            await _donationRepository.Update(donation);
            donation.CreatedAt = DateTime.Now;
            return _mapper.Map<DonationDTO>(donation);
        }
        public async Task<bool> CheckDonation(string username, int id, string message, decimal amount)
        {
            var donation = await _donationRepository.GetDonationByUser(username)
                ?? throw new Exception("Not found.");
            if (donation.Id == id && donation.Message == message && donation.Amount == amount)
            {
                return true;
            }
            return false;
        }

        public async Task DeleteUserDonation(string username)
        {
            var donation = await _donationRepository.GetDonationByUser(username)
                ?? throw new Exception("Not found.");
            if (donation.Tid == null)
            {
                await _donationRepository.DeleteUserDonation(donation);
            }
        }
        public async Task<IEnumerable<DonationStatisticsDTO>> GetStatisticsDonations(string action,
            int date)
        {
            DateTime startDate, endDate = DateTime.Now;

            switch (action)
            {
                case "day":
                    startDate = endDate.AddDays(-date);
                    break;
                case "year":
                    startDate = new DateTime(date, 1, 1);
                    endDate = new DateTime(date, 12, 31);
                    break;
                case "month":
                    startDate = new DateTime(endDate.Year, date, 1);
                    int daysInMonth = DateTime.DaysInMonth(endDate.Year, date);
                    endDate = new DateTime(endDate.Year, date, daysInMonth);
                    break;
                default:
                    throw new Exception("Invalid period");
            }

            var donations = await _donationRepository.GetStatisticsDonations(startDate, endDate);
            var groupedSthatistics = donations.GroupBy(d => d.CreatedAt.Date)
                .Select(group => new DonationStatisticsDTO
                {
                    Date = DateOnly.FromDateTime(group.Key),
                    TotalAmount = group.Sum(d => d.Amount),
                    TotalDonation = group.Count()
                });
            var allDates = Enumerable.Range(0, (endDate.Date - startDate.Date).Days + 1)
                .Select(offset => startDate.Date.AddDays(offset))
                .ToList();
            var completeStatistics = allDates.Select(date =>
            {
                var statistics = groupedSthatistics.FirstOrDefault(s => s.Date == DateOnly.FromDateTime(date));
                return statistics ?? new DonationStatisticsDTO
                {
                    Date = DateOnly.FromDateTime(date),
                    TotalAmount = 0,
                    TotalDonation = 0
                };
            });
            return completeStatistics;
        }
    }
}
