export interface Profile {
  username: string;
  firstName: string;
  lastName: string;
  postCount: number;
  commentCount: number;
  major?: string;
  gender: number;
  avatar?: string;
  phone?: string;
  banner?: string;
  bio?: string;
}

export interface CreateProfile {
  firstName: string;
  lastName: string;
  major?: string;
  gender: number;
  avatar?: string;
  phone?: string;
  banner?: string;
  bio?: string;
}

export interface EditProfile {
  firstName: string;
  lastName: string;
  major?: string;
  gender: number;
  avatar?: string;
  phone?: string;
  banner?: string;
  bio?: string;
}
