import React, { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Code2 } from 'lucide-react';
import { Login } from './Login';
import { Register } from './Register';
import { useAuth } from '../contexts/AuthContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const handleSwitchToRegister = () => setAuthView('register');
  const handleSwitchToLogin = () => setAuthView('login');

  const handleLoginSuccess = (user: any, token: string, isAdmin?: boolean) => {
    login(user, token, isAdmin);
    
    // If user is admin, redirect will be handled in the main App component
    // The admin check will be done there using user.isAdmin
  };

  const handleRegisterSuccess = (user: any, token: string) => {
    register(user, token);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f6fa',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Box sx={{ p: 2, bgcolor: '#e0e7ff', borderRadius: 2, display: 'inline-flex', alignItems: 'center' }}>
                <Code2 size={32} color="#2563eb" />
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              Loading...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we check your authentication status.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#f5f6fa',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: '#e0e0e0', py: 2 }}>
          <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, bgcolor: '#e0e7ff', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                <Code2 size={28} color="#2563eb" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Interview Buzz
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Master your coding skills with AI-powered quizzes
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Auth Content */}
        <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
          {authView === 'login' ? (
            <Login
              onSwitchToRegister={handleSwitchToRegister}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <Register
              onSwitchToLogin={handleSwitchToLogin}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
        </Container>

        {/* Footer */}
        <Paper elevation={0} sx={{ bgcolor: 'white', borderTop: 1, borderColor: '#e0e0e0', py: 2 }} square>
          <Container maxWidth="md">
            <Typography align="center" variant="body2" color="text.secondary">
              Built by Gourav •{' '}
              <a href="https://github.com" target="_blank" rel="noopener" style={{ color: '#2563eb', textDecoration: 'none' }}>
                View Source
              </a>
            </Typography>
          </Container>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
};
