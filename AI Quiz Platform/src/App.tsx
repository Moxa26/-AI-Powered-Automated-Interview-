import { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Link, Stack, Paper } from '@mui/material';
import { Brain, Zap, BookOpen, Target } from 'lucide-react';
import { QuizGenerator } from './components/QuizGenerator';
import { QuizTaker } from './components/QuizTaker';
import { QuizResults } from './components/QuizResults';
import Login from "./components/Login";
import type { Quiz, QuizResult } from './types/quiz';

const primary = '#2563eb';
const secondary = '#f5f6fa';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'generator' | 'quiz' | 'results'>('login');

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleLoginSuccess = () => {
    setCurrentView('generator');
  };

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

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'generator':
        return <QuizGenerator onQuizGenerated={handleQuizGenerated} />;
      case 'quiz':
        return currentQuiz ? (
          <QuizTaker quiz={currentQuiz} onQuizComplete={handleQuizComplete} onBack={handleBackToGenerator} />
        ) : null;
      case 'results':
        return currentQuiz && quizResult ? (
          <QuizResults quiz={currentQuiz} result={quizResult} onBack={handleBackToGenerator} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6">Quiz Generator by Gourav</Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>{renderContent()}</Container>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 4, py: 2, textAlign: 'center' }}>
        Built by WebAslhar • <Link href="#">View Source</Link>
      </Box>
    </>
  );
}


export default App;
