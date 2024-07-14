

using FStudyForum.Core.Models.DTOs.Report;
using FStudyForum.Core.Models.Entities;

namespace FStudyForum.Core.Interfaces.IRepositories
{
    public interface IReportRepository
    {
        Task<bool> SaveReport(ReportDTO reportDto);
        Task<IEnumerable<Report>> GetAllUserReportsFromRepo();
        Task<ReportDTO> GetReportByIdAsync(long id);
        Task<Report> ResponseReportRepo(ReportDTO reportDto, string response);
    }
}