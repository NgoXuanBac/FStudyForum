using AutoMapper;
using FStudyForum.Core.Interfaces.IRepositories;
using FStudyForum.Core.Models.DTOs.Report;
using FStudyForum.Core.Models.Entities;
using FStudyForum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FStudyForum.Infrastructure.Repositories
{
    public class ReportRepository(ApplicationDBContext dbContext, IMapper mapper)
        : BaseRepository<Report>(dbContext), IReportRepository
    {
        private readonly IMapper _mapper = mapper;

        public async Task<IEnumerable<Report>> GetAllUserReportsFromRepo()
        {
            var reports = await _dbContext.Reports
                .Include(r => r.Creater)
                .ToListAsync()
                ?? throw new Exception("Error while fetching reports");
            return reports;
        }

        public async Task<bool> SaveReport(ReportDTO reportDto)
        {
            var report = _mapper.Map<Report>(reportDto) 
                ?? throw new Exception("Error while mapping report");

            // Sử dụng await với AnyAsync để kiểm tra một cách bất đồng bộ
            if (!await _dbContext.Posts.AnyAsync(p => p.Id == reportDto.Content.ReportedPostId))
                throw new Exception("Post not found");
            if (!await _dbContext.Topics.AnyAsync(t => t.Name == reportDto.Content.ReportedTopicname))
                throw new Exception("Topic not found");
            if (!await _dbContext.Users.AnyAsync(u => u.UserName == reportDto.Content.ReportedUsername))
                throw new Exception("Reported User not found");
            if (!await _dbContext.Users.AnyAsync(r => r.Email == reportDto.Creater))
                throw new Exception("User not found");

            await _dbContext.Reports.AddAsync(report);
            var res = await _dbContext.SaveChangesAsync();
            return res > 0;
        }

        public async Task<ReportDTO> GetReportByIdAsync(long id)
        {
            var report = await _dbContext.Reports
                .Include(r => r.Creater)
                .FirstOrDefaultAsync(r => r.Id == id)
                ?? throw new Exception("Report not found");

            return _mapper.Map<ReportDTO>(report);
        }

        public async Task<Report> ResponseReportRepo(ReportDTO reportDto, string response)
        {
            var report = await _dbContext.Reports
                .FirstOrDefaultAsync(r => r.Id == reportDto.Id)
                ?? throw new Exception("Report not found");

            report.ResponseContent = response;
            _dbContext.Entry(report).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            return report;
        }
    }
}