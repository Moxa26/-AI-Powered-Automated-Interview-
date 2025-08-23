import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

const API_BASE_URL = 'http://192.168.1.79:5000/api'; // Your real API endpoint

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

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
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

      // Transform the response to match our expected format
      return {
        user: {
          id: response.user?.id || Date.now().toString(),
          username: credentials.username, // Use the original username
          name: response.user?.name || response.user?.username || 'User',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
        token: response.token || (response as any).access_token || 'token-' + Date.now(),
        message: response.message || 'Login successful',
      };
    } catch (error) {
      console.log('Real API failed, falling back to mock:', error);
      // Fallback to mock API
      return this.mockLogin(credentials);
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
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

      // Transform the response to match our expected format
      return {
        user: {
          id: response.user?.id || Date.now().toString(),
          username: userData.username,
          name: response.user?.name || userData.name,
          createdAt: new Date(),
        },
        token: response.token || (response as any).access_token || 'token-' + Date.now(),
        message: response.message || 'Registration successful',
      };
    } catch (error) {
      console.log('Real API failed, falling back to mock:', error);
      // Fallback to mock API
      return this.mockRegister(userData);
    }
  }

  static async logout(): Promise<void> {
    // Clear local storage and any stored tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  static async getCurrentUser(): Promise<AuthResponse> {
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

      return response;
    } catch (error) {
      console.log('Real API failed for getCurrentUser:', error);
      throw error;
    }
  }

  // Mock API for development (fallback when real API is not available)
  static async mockLogin(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.username === 'Jeminee' && credentials.password === 'Admin@123') {
      return {
        user: {
          id: '1',
          username: credentials.username,
          name: 'Demo User',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
        token: 'mock-jwt-token-' + Date.now(),
        message: 'Login successful',
      };
    }

    throw new Error('Invalid credentials');
  }

  static async mockRegister(userData: RegisterRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    return {
      user: {
        id: Date.now().toString(),
        username: userData.username,
        name: userData.name,
        createdAt: new Date(),
      },
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Registration successful',
    };
  }
}
