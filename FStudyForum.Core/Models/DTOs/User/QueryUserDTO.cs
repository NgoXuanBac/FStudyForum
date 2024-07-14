namespace FStudyForum.Core.Models.DTOs.User;

public class QueryUserDTO : QueryParameters
{
    public QueryUserDTO()
    {
        OrderBy = "UserName";
    }

}
