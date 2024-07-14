import { ResponseWith, Response } from "@/types/response";
import api from "./api";
import {
  StatisticsPost,
  CreatePost,
  EditPost,
  Post,
  SavePost
} from "@/types/post";

const save = async (postId: number) => {
  const response = await api.post<ResponseWith<SavePost>>(
    `/post/save/${postId}`
  );
  return response.data.message;
};
const removeFromSaved = async (postId: number) => {
  const response = await api.delete<ResponseWith<SavePost>>(
    `/post/remove-save/${postId}`
  );
  return response.data.message;
};
const isSaved = async (username: string, postId: number) => {
  const response = await api.get<ResponseWith<boolean>>(
    `/post/saved/${username}/${postId}`
  );
  return response.data.data;
};
const getSavedPosts = async (username: string) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/post/saved-all/${username}`
  );
  return response.data.data;
};

const getPosts = async (
  pageNumber: number,
  pageSize: number,
  filter: string
) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/post/all?pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`
  );

  return response.data.data;
};

const getPostsByTopicName = async (
  topicName: string,
  pageNumber: number,
  pageSize: number,
  filter: string
) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/post/all?topic=${topicName}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`
  );
  return response.data.data;
};



const getPostsByUser = async (
  userName: string,
  pageNumber: number,
  pageSize: number,
  filter: string
) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/post/all?user=${userName}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`
  );
  return response.data.data;
};
const getPostsInProfile = async (
  userName: string,
  pageNumber: number,
  pageSize: number,
  filter: string
) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/post/all?user=${userName}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}&type=0`
  );
  return response.data.data;
};

const getPostsInTrash = async (
  userName: string,
  pageNumber: number,
  pageSize: number,
  filter: string
) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/post/all?user=${userName}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}&type=2`
  );
  return response.data.data;
};

const create = async (post: CreatePost) => {
  const response = await api.post<ResponseWith<Post>>("/post/create", post);
  return response.data.data;
};

const edit = async (postId: number, post: EditPost) => {
  const response = await api.patch<ResponseWith<Post>>(
    `/post/edit/${postId}`,
    post
  );
  return response.data.data;
};

const moveToTrash = async (postId: number) => {
  const response = await api.post<Response>(`/post/move-trash/${postId}`);
  return response.data.message;
};
const restoreFromTrash = async (postId: number) => {
  const response = await api.post<Response>(`/post/restore-trash/${postId}`);
  return response.data.message;
};
const deleteForever = async (postId: number) => {
  const response = await api.delete<Response>(`/post/delete/${postId}`);
  return response.data.message;
};

const getById = async (id: string) => {
  const response = await api.get<ResponseWith<Post>>(`/post/${id}`);
  return response.data.data;
};

const addRecent = async (postId: number) => {
  const response = await api.post<ResponseWith<Post>>(`/post/recent/${postId}`);
  return response.data;
};

const getRecentPosts = async () => {
  const response = await api.get<ResponseWith<Post[]>>("/post/recent");
  return response.data.data;
};

const clearRecent = async () => {
  const response = await api.delete<ResponseWith<boolean>>(
    "/post/clear-recent"
  );
  return response.data.data;
};

const getStatisticsPost = async (action: string, date: number) => {
  const response = await api.get<ResponseWith<StatisticsPost[]>>(
    `post/statistics=${action}&date=${date}`
  );
  return response.data;
};
const PostService = {
  clearRecent,
  addRecent,
  getRecentPosts,
  save,
  removeFromSaved,
  isSaved,
  getSavedPosts,
  getPostsByTopicName,
  getPostsInProfile,
  getPostsInTrash,
  restoreFromTrash,
  getPostsByUser,
  deleteForever,
  getPosts,
  create,
  edit,
  moveToTrash,
  getById,
  getStatisticsPost
};

export default PostService;
