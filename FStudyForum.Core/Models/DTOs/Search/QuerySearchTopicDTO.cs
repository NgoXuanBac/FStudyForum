using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudyForum.Core.Models.DTOs.Search
{
    public class QuerySearchTopicDTO : QueryParameters
    {
        public string Keyword { get; set; } = string.Empty;
        public QuerySearchTopicDTO()
        {
            OrderBy = "CreatedAt";
        }
    }
}