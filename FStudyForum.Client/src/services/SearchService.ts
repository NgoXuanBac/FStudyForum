import { ResponseWith } from "@/types/response";
import api from "./api";
import { Comment } from "@/types/comment";
import { Post } from "@/types/post";
import { User } from "@/types/user";
import { Topic } from "@/types/topic";

const searchComments = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
  filter: string
) => {
  const response = await api.get<ResponseWith<Comment[]>>(
    `/search/comment?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`
  );
  return response.data.data;
};
const searchCommentsUser = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
  filter: string,
  user: string) => {
  const response = await api.get<ResponseWith<Comment[]>>(`/search/comment?user=${user}&keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`);
  return response.data.data;
};
const searchCommentsTopic = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
  filter: string,
  topic: string) => {
  const response = await api.get<ResponseWith<Comment[]>>(`/search/comment?topic=${topic}&keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`);
  return response.data.data;
};

const searchPosts = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
  filter: string
) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/search/post?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`
  );
  return response.data.data;
};

const searchUsers = async (
  keyword: string,
  pageNumber: number,
  pageSize: number
) => {
  const response = await api.get<ResponseWith<User[]>>(
    `/search/user?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data.data;
};

const searchPostByKeywordInUser = async (
  keyword: string,
  pageNumber: number,
  pageSize: number,
  filter: string,
  user: string,
) => {
  const response = await api.get<ResponseWith<Post[]>>(`/search/post?keyword=${keyword}&user=${user}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`);
  return response.data.data;
};


const searchTopics = async (
  keyword: string,
  pageNumber: number,
  pageSize: number
) => {
  const response = await api.get<ResponseWith<Topic[]>>(
    `/search/topic?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data.data;
};

const searchPostsByKeywordInTopic = async (
  topicName: string,
  pageNumber: number,
  pageSize: number,
  filter: string,
  keyword: string
) => {
  const response = await api.get<ResponseWith<Post[]>>(
    `/search/post?topic=${topicName}&keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${filter}`
  );
  return response.data.data;
};

const SearchService = {
  searchComments,
  searchPosts,
  searchUsers,
  searchTopics,
  searchPostByKeywordInUser,
  searchPostsByKeywordInTopic,
  searchCommentsUser,
  searchCommentsTopic,
};

export default SearchService;
