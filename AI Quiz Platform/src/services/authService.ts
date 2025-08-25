import type { LoginRequest, RegisterRequest, AuthResponse, User, CreateUserRequest } from '../types/auth';
import type { QuizResult, Quiz } from '../types/quiz';

const API_BASE_URL = process.env.BACK_END_POINT || 'http://192.168.1.79:4000/api'; // Quiz score API endp
// oint

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
        createdAt: response.user?.created_at ? new Date(response.user.created_at) : new Date(),
        lastLoginAt: new Date(),
        // Handle both nested and direct preference formats
        quizPreferences: response.user?.quiz_preferences ? {
          topic: response.user.quiz_preferences.topic,
          difficulty: response.user.quiz_preferences.difficulty,
          question_type: response.user.quiz_preferences.question_type
        } : (response.user?.topic && response.user?.difficulty && response.user?.question_type) ? {
          topic: response.user.topic,
          difficulty: response.user.difficulty,
          question_type: response.user.question_type
        } : undefined,
        // Store direct preference fields as well for compatibility
        topic: response.user?.topic,
        difficulty: response.user?.difficulty,
        question_type: response.user?.question_type,
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

  // Save complete quiz details with questions and answers
  static async saveQuizDetails(quiz: Quiz, result: QuizResult, userId: string): Promise<void> {
    try {
      const quizDetailsData = {
        userId: parseInt(userId), // Include userId in the payload
        questions: quiz.questions.map((question, index) => {
          const userAnswer = result.answers[index];
          return {
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation || '',
            userSelectedAnswer: userAnswer.selectedAnswer !== undefined ? userAnswer.selectedAnswer : null,
            userTextAnswer: userAnswer.textAnswer || null,
            isCorrect: userAnswer.isCorrect,
            questionType: question.questionType,
            codeSnippet: question.codeSnippet || null,
            codeLanguage: question.codeLanguage || null
          };
        })
      };

      await this.makeRequest('/quizzesDetail', {
        method: 'POST',
        body: JSON.stringify(quizDetailsData),
      });

      console.log('Quiz details saved successfully:', quizDetailsData);
    } catch (error) {
      console.error('Failed to save quiz details:', error);
      // Don't throw error to prevent disrupting user experience
    }
  }

  // Helper method to generate feedback based on score
  private static generateFeedback(score: number): string {
    if (score >= 90) return 'Excellent! Outstanding performance!';
    if (score >= 80) return 'Great job! Well done!';
    if (score >= 70) return 'Good work! Keep it up!';
    if (score >= 60) return 'Not bad! Room for improvement.';
    return 'Keep practicing! You can do better!';
  }

  // Fetch quiz data by users for admin dashboard
  static async getQuizByUsers(): Promise<any[]> {
    try {
      const response = await this.makeRequest<{success: boolean; quizzes: any[]}>('/quiz-by-users', {
        method: 'GET',
      });

      return response.quizzes || [];
    } catch (error) {
      console.error('Failed to fetch quiz data:', error);
      throw error;
    }
  }

  // Create user with quiz preferences for admin
  static async createUserWithQuizPreferences(userData: CreateUserRequest): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const response = await this.makeRequest<{ success: boolean; message: string; user?: any }>('/users-with-quiz', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }
}
