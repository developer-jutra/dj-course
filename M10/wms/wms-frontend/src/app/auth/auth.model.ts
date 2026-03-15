import { UserProfile } from '../features/user-management/user.model';

// User Authentication
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
  expiresAt: number;
}