using System.Security.Claims;
using FStudyForum.Core.Constants;
using FStudyForum.Core.Interfaces.IServices;
using FStudyForum.Core.Models.DTOs;
using FStudyForum.Core.Models.DTOs.Report;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
namespace FStudyForum.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;
        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("all")]
        public IActionResult GetAllReport()
        {
            return Ok(new Response
            {
                Status = ResponseStatus.SUCCESS,
                Message = "Get all report successfully",
                Data = Report.All
            });
        }

        [HttpGet("user-report")]
        public async Task<IActionResult> GetUserReport()
        {
            try
            {
                var reports = await _reportService.GetAllUserReports();
                if (reports.IsNullOrEmpty())
                {
                    return BadRequest(new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = "No report found"
                    });
                }
                else
                {
                    return Ok(new Response
                    {
                        Status = ResponseStatus.SUCCESS,
                        Message = "Get user report successfully",
                        Data = reports
                    });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = e.Message
                });
            }
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendReport([FromBody] ReportDTO reportDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var Email = User.FindFirstValue(ClaimTypes.Email); 
            if (Email == null || Email != reportDto.Creater) return Unauthorized(new Response
            {
                Status = ResponseStatus.ERROR,
                Message = "User is not authenticated"
            });
            try
            {
                var report = await _reportService.SaveReport(reportDto);

                return Ok(new Response
                {
                    Status = ResponseStatus.SUCCESS,
                    Message = "Send report successfully",
                    Data = report
                });
            }
            catch (Exception e)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = e.Message
                });
            }
        }

        [HttpPut("response/{id}")]
        public async Task<IActionResult> ResponseReport([FromRoute] long id, [FromBody] ReportResponseDTO reportResponse)
        {
            if (string.IsNullOrWhiteSpace(reportResponse.ResponseContent)) 
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = "The ResponseContent field is required."
                });
            }
            try
            {
                var report = await _reportService.ResponseReportService(id, reportResponse.ResponseContent);
                if (report == null)
                {
                    return NotFound(new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = "Report not found"
                    });
                }
                else
                {
                    return Ok(new Response
                    {
                        Status = ResponseStatus.SUCCESS,
                        Message = "Response report successfully",
                        Data = report
                    });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = e.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReportById(long id)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var report = await _reportService.GetReportByIdService(id);
                if (report == null)
                {
                    return NotFound(new Response
                    {
                        Status = ResponseStatus.ERROR,
                        Message = "Report not found"
                    });
                }
                else
                {
                    return Ok(new Response
                    {
                        Status = ResponseStatus.SUCCESS,
                        Message = "Get report successfully",
                        Data = report
                    });
                }
            }
            catch (Exception e)
            {
                return BadRequest(new Response
                {
                    Status = ResponseStatus.ERROR,
                    Message = e.Message
                });
            }
        }
    }
}