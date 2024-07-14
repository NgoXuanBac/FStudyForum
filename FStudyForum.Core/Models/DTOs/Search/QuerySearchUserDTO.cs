using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FStudyForum.Core.Models.DTOs.Search
{
    public class QuerySearchUserDTO : QueryParameters
    {
        public string Keyword { get; set; } = string.Empty;
        public QuerySearchUserDTO()
        {
            OrderBy = "CreatedAt";
        }
    }
}