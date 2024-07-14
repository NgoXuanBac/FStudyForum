import { CreateFeed, Feed } from "@/types/feed";
import api from "./api";
import { ResponseWith, Response } from "@/types/response";

const getFeed = async (name: string) => {
  const response = await api.get<ResponseWith<Feed>>(`/feed/${name}`);
  return response.data.data;
};

const createFeed = async (payload: CreateFeed) => {
  const response = await api.post<Response>(`/feed/create`, payload);
  return response.data.message;
};

const deleteFeed = async (name: string) => {
  const response = await api.delete<Response>(`/feed/${name}`);
  return response.data.message;
};

const addTopicToFeed = async (name: string, topicName: string) => {
  const response = await api.post<Response>(`/feed/add`, {
    feedName: name,
    topicName
  });
  return response.data.message;
};

const removeTopicFromFeed = async (name: string, topicName: string) => {
  const response = await api.post<Response>(`/feed/remove`, {
    feedName: name,
    topicName
  });
  return response.data.message;
};

const FeedService = {
  getFeed,
  addTopicToFeed,
  removeTopicFromFeed,
  createFeed,
  deleteFeed
};

export default FeedService;
