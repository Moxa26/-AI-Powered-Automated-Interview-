import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import type { QuizResult } from '../types/quiz';

const API_BASE_URL = process.env.BACK_END_POINT || 'http://192.168.1.79:4000/api'; // Quiz score API endpoint

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

  // Save quiz score to backend API
  static async saveQuizScore(userId: string, result: QuizResult): Promise<void> {
    try {
      const timeTakenFormatted = this.formatTimeForAPI(result.timeTaken);
      const feedback = this.generateFeedback(result.score);
      
      const scoreData = {
        userId: parseInt(userId),
        quizId: 2, // Fixed quizId as requested
        scorePercent: parseFloat(result.score.toFixed(2)),
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        timeTaken: timeTakenFormatted,
        feedback: feedback
      };

      await this.makeRequest('/save-quiz-score', {
        method: 'POST',
        body: JSON.stringify(scoreData),
      });

      console.log('Quiz score saved successfully:', scoreData);
    } catch (error) {
      console.error('Failed to save quiz score:', error);
      // Don't throw error to prevent disrupting user experience
    }
  }

  // Helper method to format time for API (HH:MM:SS format)
  private static formatTimeForAPI(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Helper method to generate feedback based on score
  private static generateFeedback(score: number): string {
    if (score >= 90) return 'Excellent! Outstanding performance!';
    if (score >= 80) return 'Great job! Well done!';
    if (score >= 70) return 'Good work! Keep it up!';
    if (score >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You can do better!';
  }
}
