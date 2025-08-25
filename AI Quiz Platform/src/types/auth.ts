export interface User {
  id: string;
  username: string;
  name: string;
  isAdmin?: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  // Support both nested and direct preference formats
  quizPreferences?: {
    topic: string;
    difficulty: string;
    question_type: string;
  };
  // Direct preference fields (new format)
  topic?: string;
  difficulty?: string;
  question_type?: string;
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

export interface CreateUserRequest {
  username: string;
  password: string;
  topic: string | string[]; // Support both single and multiple topics
  difficulty: string;
  question_type: string;
}

export interface AuthResponse {
  success?: boolean;
  message: string;
  user: {
    id: number | string;
    username: string;
    password_hash?: string;
    is_admin?: boolean;
    // New format - direct fields
    topic?: string;
    difficulty?: string;
    question_type?: string;
    created_at?: string;
    // Old format - nested preferences (for backward compatibility)
    quiz_preferences?: {
      topic: string;
      difficulty: string;
      question_type: string;
    };
  };
  token?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
