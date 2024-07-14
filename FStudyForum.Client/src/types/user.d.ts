import { Topic } from "./topic";

export interface User {
  username: string;
  email: string;
  roles: Array<string>;
  mods: Array<Topic>;
  avatar: string;
}
