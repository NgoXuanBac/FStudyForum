using FStudyForum.Core.Constants;

namespace FStudyForum.Core.Models.DTOs.Vote;

public class VoteDTO
{
    public long PostId { get; set; }
    public VoteType Type { get; set; }

}
