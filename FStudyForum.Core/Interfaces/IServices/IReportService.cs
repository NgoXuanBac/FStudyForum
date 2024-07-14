using FStudyForum.Core.Models.DTOs.Report;

namespace FStudyForum.Core.Interfaces.IServices
{
    public interface IReportService
    {
        Task<ReportDTO?> SaveReport(ReportDTO report);
        Task<List<ReportDTO>> GetAllUserReports();
        Task<ReportDTO> GetReportByIdService(long id);
        Task<ReportDTO> ResponseReportService(long id, string response);
    }
}