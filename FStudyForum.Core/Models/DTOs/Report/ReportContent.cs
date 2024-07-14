using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace FStudyForum.Core.Models.DTOs.Report
{
    public class ReportContent
    {
        [JsonProperty(nameof(Content))]
        public string Content { get; set; } = string.Empty;
        [JsonProperty(nameof(ReportedPostId))]
        public long ReportedPostId { get; set; }
        [JsonProperty(nameof(ReportedTopicname))]
        public string ReportedTopicname { get; set; } = string.Empty;
        [JsonProperty(nameof(ReportedUsername))]
        public string ReportedUsername { get; set; } = string.Empty;
    }
}