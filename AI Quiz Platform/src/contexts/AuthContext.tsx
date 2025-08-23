import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (user: User, token: string, isAdmin?: boolean) => void;
  logout: () => void;
  register: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check if user is already logged in on app start
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    checkAuthStatus();
  }, []);

  const login = (user: User, token: string, isAdmin?: boolean) => {
    // Store auth data in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const register = (user: User, token: string) => {
    // Store auth data in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
