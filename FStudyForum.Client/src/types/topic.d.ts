export interface Topic {
  id: number;
  name: string;
  description: string;
  avatar: string;
  banner: string;
  postCount: number;
  isDeleted: boolean;
  categories: number[];
}
export type TopicType = {
  name: string;
  description: string;
  avatar: string;
  banner: string;
  categories: number[];
};

export interface CreateTopic {
  name: string;
  description: string;
  avatar: string;
  banner: string;
  categories: number[];
}
export interface UpdateTopic {
  name: string;
  description: string;
  avatar: string;
  banner: string;
  categories: number[];
}
export interface CreateTopicBan {
  username: string;
  topicName: string;
  action: string;
  time: number;
}

export interface TopicBan {
  topicName: string;
  bannedTime: Date;
}
