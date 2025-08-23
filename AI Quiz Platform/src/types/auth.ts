export interface User {
  id: string;
  username: string;
  name: string;
  isAdmin?: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success?: boolean;
  user: {
    id: number | string;
    username: string;
    is_admin?: boolean;
  };
  token?: string;
  message: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
