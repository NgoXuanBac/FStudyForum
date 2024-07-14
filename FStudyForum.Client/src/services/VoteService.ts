import api from "./api";
import { ResponseWith } from "@/types/response";

const votePost = async (postId: number, type: number) => {
  const response = await api.patch<ResponseWith<number>>("/vote/post", {
    postId,
    type
  });
  return response.data.data;
};
const voteComment = async (commentId: number, type: number) => {
  const response = await api.patch<ResponseWith<number>>("/vote/comment", {
    commentId,
    type
  });
  return response.data.data;
};

const VoteService = {
  votePost,
  voteComment
};

export default VoteService;
