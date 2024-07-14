import { ResponseWith } from "@/types/response";
import api from "./api";
import {
  Topic,
  CreateTopic,
  UpdateTopic,
  CreateTopicBan,
  TopicBan
} from "@/types/topic";

const getActiveTopics = async (): Promise<Topic[]> => {
  const response = await api.get<Topic[]>("/topic/active-all");
  return response.data;
};

const getTopics = async () => {
  const response = await api.get<ResponseWith<Topic[]>>("/topic/all");
  return response.data.data;
};

const getTopicByName = async (name: string) => {
  const response = await api.get<ResponseWith<Topic>>(`/topic/${name}`);
  return response.data.data;
};

const create = async (topic: CreateTopic): Promise<Topic> => {
  const response = await api.post<Topic>("/topic/create", topic);
  return response.data;
};

const update = async (name: string, topic: UpdateTopic): Promise<Topic> => {
  const response = await api.put<Topic>(`/topic/update/${name}`, topic);
  return response.data;
};

const deleteTopic = async (name: string): Promise<void> => {
  await api.put<Topic>(`/topic/delete/${name}`);
};

const checkBannedUser = async (username: string, topicName: string) => {
  const response = await api.get<ResponseWith<TopicBan>>(
    `/topic/check-banned?username=${username}&topicName=${topicName}`
  );
  return response.data.data;
};

const unbanUser = async (username: string, topicName: string) => {
  const response = await api.post<Response>("/topic/unban", {
    username,
    topicName
  });
  return response.data;
};

const banUser = async (topicban: CreateTopicBan) => {
  const response = await api.post<ResponseWith<TopicBan>>(
    "/topic/ban",
    topicban
  );
  return response.data;
};

const search = async (value: string) => {
  const response = await api.get<ResponseWith<Topic[]>>(
    "/topic/search?value=" + value + "&size=10"
  );
  return response.data.data;
};
const filterByCategories = async (categoryIds: number[]): Promise<Topic[]> => {
  const response = await api.get<ResponseWith<Topic[]>>(`/topic/filter?categoryIds=${categoryIds.join(',')}`);
  return response.data.data;
};
const TopicService = {
  getTopics,
  getActiveTopics,
  getTopicByName,
  search,
  create,
  update,
  deleteTopic,
  checkBannedUser,
  unbanUser,
  banUser,
  filterByCategories
};

export default TopicService;
