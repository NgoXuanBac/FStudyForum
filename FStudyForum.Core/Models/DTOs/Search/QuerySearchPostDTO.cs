using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudyForum.Core.Models.DTOs.Search
{
    public class QuerySearchPostDTO: QueryParameters
{
    public string Filter { get; set; } = string.Empty;
    public string User { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public string Keyword { get; set; } = string.Empty;
    public QuerySearchPostDTO()
    {
        OrderBy = "CreatedAt";
    }
}
}