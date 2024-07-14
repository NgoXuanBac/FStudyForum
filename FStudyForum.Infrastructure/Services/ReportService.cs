using AutoMapper;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs.Report;
using FStudyForum.Core.Models.Entities;

namespace FStudyForum.Infrastructure.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IMapper _mapper;
        public ReportService(IReportRepository reportRepository,IMapper mapper)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
        }


        public async Task<ReportDTO?> SaveReport(ReportDTO reportDto)
        {
            if (!await _reportRepository.SaveReport(reportDto)) return null;
            return reportDto;
        }
        public async Task<List<ReportDTO>> GetAllUserReports()
        {
            var reports = await _reportRepository.GetAllUserReportsFromRepo();
            return _mapper.Map<List<ReportDTO>>(reports);
        }

        public async Task<ReportDTO> GetReportByIdService(long id)
        {
            var reportDto = await _reportRepository.GetReportByIdAsync(id);
            return reportDto;
        }

        public async Task<ReportDTO> ResponseReportService(long id, string response)
        {
            var reportDto = await GetReportByIdService(id);
            var report = await _reportRepository.ResponseReportRepo(reportDto, response);
            return _mapper.Map<ReportDTO>(report);
        }
    }
}