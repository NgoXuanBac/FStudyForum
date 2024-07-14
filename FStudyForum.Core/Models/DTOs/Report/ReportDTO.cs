using System.ComponentModel.DataAnnotations;
namespace FStudyForum.Core.Models.DTOs.Report
{
     public class ReportDTO
     {
          public long Id { get; set; }
          [MinLength(1, ErrorMessage = "Type cannot be empty")]
          public string Type { get; set; } = string.Empty;
          public ReportContent Content { get; set; } = new ReportContent();
          public string? ResponseContent { get; set; } = string.Empty;
          public string Creater { get; set; } = string.Empty;
     }
}