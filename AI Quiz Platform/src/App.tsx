import { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Link, Stack, Paper, Button, Avatar, Menu, MenuItem } from '@mui/material';
import { Code2, Zap, BookOpen, Target, LogOut, User } from 'lucide-react';
import { QuizGenerator } from './components/QuizGenerator';
import { QuizTaker } from './components/QuizTaker';
import { QuizResults } from './components/QuizResults';
import { AuthWrapper } from './components/AuthWrapper';
import { useAuth } from './contexts/AuthContext';
import type { Quiz, QuizResult } from './types/quiz';

const primary = '#2563eb';
const secondary = '#f5f6fa';

function AppContent() {
  const [currentView, setCurrentView] = useState<'generator' | 'quiz' | 'results'>('generator');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleQuizGenerated = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentView('results');
  };

  const handleBackToGenerator = () => {
    setCurrentView('generator');
    setCurrentQuiz(null);
    setQuizResult(null);
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
            <Box sx={{ p: 1, bgcolor: '#e0e7ff', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
              <Code2 size={28} color={primary} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Interview Buzz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Master your coding skills with AI-powered quizzes
              </Typography>
            </Box>
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
            Built by Gourav •{' '}
            <Link href="https://github.com" target="_blank" rel="noopener" color="primary">
              View Source
            </Link>
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
