import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const API_BASE_URL = 'http://192.168.1.79:4000/api'; // Your real API endpoint

export class AuthService {
  private static async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async login(credentials: LoginRequest): Promise<{ user: User; token: string; message: string; isAdmin: boolean }> {
    try {
      debugger;
      // Transform the request to match your API format
      const apiRequest = {
        username: credentials.username, // Use username directly
        password: credentials.password
      };

      // Call your real API
      const response = await this.makeRequest<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(apiRequest),
      });

      // Transform the API response to our internal User format
      const user: User = {
        id: response.user?.id?.toString() || Date.now().toString(),
        username: response.user?.username || credentials.username,
        name: response.user?.username || credentials.username, // Use username as name
        isAdmin: response.user?.is_admin || false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      return {
        user,
        token: response.token || 'token-' + Date.now(),
        message: response.message || 'Login successful',
        isAdmin: response.user?.is_admin || false,
      };
    } catch (error) {
      console.log('Real API failed:', error);
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }

  static async register(userData: RegisterRequest): Promise<{ user: User; token: string; message: string; isAdmin: boolean }> {
    try {
      // Transform the request to match your API format if you have a register endpoint
      const apiRequest = {
        username: userData.username, // Use username directly
        password: userData.password,
        name: userData.name
      };

      // Call your real API (adjust endpoint if different)
      const response = await this.makeRequest<AuthResponse>('/register', {
        method: 'POST',
        body: JSON.stringify(apiRequest),
      });

      // Transform the API response to our internal User format
      const user: User = {
        id: response.user?.id?.toString() || Date.now().toString(),
        username: response.user?.username || userData.username,
        name: userData.name,
        isAdmin: response.user?.is_admin || false,
        createdAt: new Date(),
      };

      return {
        user,
        token: response.token || 'token-' + Date.now(),
        message: response.message || 'Registration successful',
        isAdmin: response.user?.is_admin || false,
      };
    } catch (error) {
      console.log('Real API failed:', error);
      throw new Error('Registration failed. Please try again.');
    }
  }

  static async logout(): Promise<void> {
    // Clear local storage and any stored tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  static async getCurrentUser(): Promise<{ user: User; token: string; message: string; isAdmin: boolean }> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      // Try real API first (adjust endpoint if different)
      const response = await this.makeRequest<AuthResponse>('/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Transform API response to internal format
      const user: User = {
        id: response.user?.id?.toString() || Date.now().toString(),
        username: response.user?.username || 'User',
        name: response.user?.username || 'User',
        isAdmin: response.user?.is_admin || false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      return {
        user,
        token: response.token || token,
        message: response.message || 'User retrieved successfully',
        isAdmin: response.user?.is_admin || false,
      };
    } catch (error) {
      console.log('Real API failed for getCurrentUser:', error);
      throw error;
    }
  }
}
