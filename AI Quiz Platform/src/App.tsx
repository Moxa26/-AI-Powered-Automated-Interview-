import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Link, Stack, Paper, Button, Avatar, Menu, MenuItem } from '@mui/material';
import { Code2, Zap, BookOpen, Target, LogOut, User, Settings } from 'lucide-react';
import { QuizGenerator } from './components/QuizGenerator';
import { QuizTaker } from './components/QuizTaker';
import { QuizResults } from './components/QuizResults';
import { AdminPage } from './components/AdminPage';
import { AuthWrapper } from './components/AuthWrapper';
import { useAuth } from './contexts/AuthContext';
import type { Quiz, QuizResult } from './types/quiz';
import logo from "./Quiz_logo.jpg"
 

const primary = '#2563eb';
const secondary = '#f5f6fa';

function AppContent() {
  const [currentView, setCurrentView] = useState<'generator' | 'quiz' | 'results' | 'admin'>('generator');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Check if user is admin and redirect accordingly
  useEffect(() => {
    if (user?.isAdmin) {
      // Check current URL path for admin route
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin') || currentPath === '/admin') {
        setCurrentView('admin');
      }
    }
  }, [user]);

  // Handle browser navigation (simple routing simulation)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin')) {
        if (user?.isAdmin) {
          setCurrentView('admin');
        } else {
          // Redirect non-admin users away from admin page
          window.history.pushState(null, '', '/');
          setCurrentView('generator');
        }
      } else {
        setCurrentView('generator');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  const handleQuizGenerated = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentView('quiz');
  };
 
  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentView('results');
  };

  const handleBackToGenerator = () => {
    window.history.pushState(null, '', '/');
    setCurrentView('generator');
    setCurrentQuiz(null);
    setQuizResult(null);
  };

  const handleGoToAdmin = () => {
    if (user?.isAdmin) {
      window.history.pushState(null, '', '/admin');
      setCurrentView('admin');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'generator':
        return <QuizGenerator onQuizGenerated={handleQuizGenerated} />;
      case 'quiz':
        return currentQuiz ? (
          <QuizTaker
            quiz={currentQuiz}
            onQuizComplete={handleQuizComplete}
            onBack={handleBackToGenerator}
          />
        ) : null;
      case 'results':
        return currentQuiz && quizResult ? (
          <QuizResults
            quiz={currentQuiz}
            result={quizResult}
            onBack={handleBackToGenerator}
          />
        ) : null;
      case 'admin':
        return user?.isAdmin ? (
          <AdminPage />
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="error">
              Access Denied
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              You don't have permission to access this page.
            </Typography>
            <Button variant="contained" onClick={handleBackToGenerator}>
              Go Back
            </Button>
          </Box>
        );
      default:
        return <QuizGenerator onQuizGenerated={handleQuizGenerated} />;
    }
  };

  return (
    <Box minHeight="100vh" bgcolor={secondary} display="flex" flexDirection="column">
      {/* Header */}
      <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 4 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Box sx={{ p: 1, bgcolor: '#e0e7ff', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
              <Code2 size={28} color={primary} />
            </Box> */}
            <Box>
             <img
            src={logo}
            alt="Logo"
            style={{ width: '250px', height: '80px', margin: '0 auto', display: 'block' }}
          />
            </Box>
            
            {/* Navigation buttons */}
            {user?.isAdmin && (
              <Stack direction="row" spacing={1} sx={{ ml: 4 }}>
                <Button
                  variant={currentView === 'generator' ? 'contained' : 'text'}
                  onClick={handleBackToGenerator}
                  size="small"
                >
                  Quiz
                </Button>
                <Button
                  variant={currentView === 'admin' ? 'contained' : 'text'}
                  onClick={handleGoToAdmin}
                  size="small"
                  startIcon={<Settings size={16} />}
                >
                  Admin
                </Button>
                
              </Stack>
            )}
          </Stack>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
           

            <Button
              onClick={handleMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.primary',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: primary }}>
                <User size={16} />
              </Avatar>

              <Typography variant="body2" fontWeight={500}>
                {user?.name}
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                },
              }}
            >
              <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
                <LogOut size={16} />
                Logout
              </MenuItem>
              {user?.isAdmin && currentView !== 'admin' && (
                <MenuItem onClick={handleGoToAdmin} sx={{ gap: 1 }}>
                  <Settings size={16} />
                  Admin Panel
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        {renderContent()}
      </Container>

      {/* Footer */}
      <Paper elevation={0} sx={{ bgcolor: 'white', borderTop: 1, borderColor: '#e0e0e0', py: 2, mt: 4 }} square>
        <Container maxWidth="md">
          <Typography align="center" variant="body2" color="text.secondary">
        Built by WebAshlar 
        {/* •{' '}
            <Link href="https://github.com" target="_blank" rel="noopener" color="primary">
              View Source
            </Link> */} 
          </Typography>
        </Container>
      </Paper>
    </Box>
  );
}

function App() {
  return (
    <AuthWrapper>
      <AppContent />
    </AuthWrapper>
  );
}

export default App;
