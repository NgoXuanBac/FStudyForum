import { User } from "@/types/user"

export interface AuthState {
  isAuthenticated?: boolean
  isInitialized?: boolean
  user: User | null
}

export interface ServerResponse {
  message: string
  status: string
}
