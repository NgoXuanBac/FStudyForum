using FStudyForum.Core.Models.DTOs.Vote;
using FStudyForum.Core.Models.Entities;


namespace FStudyForum.Core.Interfaces.IServices
{
    public interface IVoteService
    {
        public Task<IEnumerable<Vote>> GetVotes();
        public Task<int> VotePost(string userName, VoteDTO voteDTO);
        public Task<int> VoteComment(string userName, VoteCommentDTO voteCommentDTO);
    }
}
