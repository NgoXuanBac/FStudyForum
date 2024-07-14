import { ResponseWith } from "@/types/response";
import api from "./api";
import { Comment, CreateComment } from "@/types/comment";

const getCommentsByPostId = async (postId: string) => {
  const response = await api.get<ResponseWith<Comment[]>>(`/comments/post?postId=${postId}`);
  return response.data.data;
};

const getCommentById = async (id: string) => {
  const response = await api.get<ResponseWith<Comment>>(`/comments/comment?id=${id}`);
  return response.data.data;
};

const createComment = async (comment: CreateComment) => {
  const response = await api.post<ResponseWith<Comment>>("/comments/create", comment);
  return response.data.data;
};

const updateComment = async (id: string, comment: Partial<Comment>) => {
  const response = await api.put<ResponseWith<null>>(`/comments/${id}`, comment);
  return response.data;
};

const deleteComment = async (id: string) => {
  const response = await api.delete<ResponseWith<null>>(`/comments/${id}`);
  return response.data;
};

const CommentService = {
  getCommentsByPostId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};

export default CommentService;
