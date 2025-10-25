import type { User } from "./entity.types";

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}
