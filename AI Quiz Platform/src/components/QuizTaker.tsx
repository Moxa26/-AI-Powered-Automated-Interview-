import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Trophy, Code } from 'lucide-react';
import AceEditor from 'react-ace';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Quiz, QuizResult } from '../types/quiz';
import { configureAceEditor, getAceMode, getAceEditorOptions } from '../utils/aceConfig';
import { AuthService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Paper,
  IconButton,
  TextField,
  Alert,
} from '@mui/material';

// Import ace editor modes and themes
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';

interface QuizTakerProps {
  quiz: Quiz;
  onQuizComplete: (result: QuizResult) => void;
  onBack: () => void;
}

export const QuizTaker: React.FC<QuizTakerProps> = ({ quiz, onQuizComplete, onBack }) => {
  const { user } = useAuth();
  // Configure ACE Editor on component mount to prevent worker loading errors
  useEffect(() => {
    configureAceEditor();
  }, []);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [textAnswers, setTextAnswers] = useState<string[]>([]);
  const [timeStarted] = useState<Date>(new Date());

  useEffect(() => {
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
    setTextAnswers(new Array(quiz.questions.length).fill(''));
  }, [quiz.questions.length]);

  // Add additional paste prevention at document level for code input questions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentQ = quiz.questions[currentQuestionIndex];
      if (currentQ && currentQ.questionType === 'code-input') {
        // Prevent Ctrl+V (paste), Ctrl+C (copy), Ctrl+X (cut)
        if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'c' || e.key === 'x')) {
          e.preventDefault();
          alert('❌ Copy/Cut/Paste operations are disabled for coding questions. Please write the code yourself.');
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const currentQ = quiz.questions[currentQuestionIndex];
      if (currentQ && currentQ.questionType === 'code-input') {
        e.preventDefault();
        alert('❌ Paste operation is disabled. Please write the code yourself to demonstrate your coding skills.');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('paste', handlePaste);
    };
  }, [currentQuestionIndex, quiz.questions]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const hasAnsweredCurrent = currentQuestion.questionType === 'code-input' 
    ? textAnswers[currentQuestionIndex].trim() !== ''
    : selectedAnswers[currentQuestionIndex] !== -1;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleTextAnswerChange = (value: string) => {
    const newTextAnswers = [...textAnswers];
    newTextAnswers[currentQuestionIndex] = value;
    setTextAnswers(newTextAnswers);
  };

  // Prevent copy and paste operations for code input questions
  const handleCodeEditorLoad = (editor: any) => {
    // Disable paste operation
    editor.commands.addCommand({
      name: 'disablePaste',
      bindKey: { win: 'Ctrl-V', mac: 'Cmd-V' },
      exec: () => {
        // Show alert when user tries to paste
        alert('❌ Paste operation is disabled. Please write the code yourself to demonstrate your coding skills.');
        return false;
      }
    });

    // Disable copy operation
    editor.commands.addCommand({
      name: 'disableCopy',
      bindKey: { win: 'Ctrl-C', mac: 'Cmd-C' },
      exec: () => {
        // Show alert when user tries to copy
        alert('❌ Copy operation is disabled.');
        return false;
      }
    });

    // Disable cut operation
    editor.commands.addCommand({
      name: 'disableCut',
      bindKey: { win: 'Ctrl-X', mac: 'Cmd-X' },
      exec: () => {
        // Show alert when user tries to cut
        alert('❌ Cut operation is disabled.');
        return false;
      }
    });

    // Also disable right-click context menu
    editor.container.addEventListener('contextmenu', (e: Event) => {
      e.preventDefault();
      alert('❌ Right-click menu is disabled to prevent copy/paste operations.');
    });
  };

  const evaluateCodeAnswer = (userCode: string, expectedCode: string, language: string): boolean => {
    // Add null/undefined checks to prevent runtime errors
    if (!userCode || !expectedCode) {
      return false;
    }
    
    if (!userCode.trim() || !expectedCode.trim()) {
      return false;
    }

    // Remove extra whitespace and normalize
    const normalizeCode = (code: string) => {
      if (!code) {
        return '';
      }
      return code
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/;\s*}/g, '}') // Handle semicolon before closing brace
        .replace(/\s*{\s*/g, '{') // Normalize opening braces
        .replace(/\s*}\s*/g, '}') // Normalize closing braces
        .replace(/\s*\(\s*/g, '(') // Normalize opening parentheses
        .replace(/\s*\)\s*/g, ')') // Normalize closing parentheses
        .replace(/\s*,\s*/g, ',') // Normalize commas
        .replace(/\s*;\s*/g, ';') // Normalize semicolons
        .trim()
        .toLowerCase();
    };

    const userNormalized = normalizeCode(userCode);
    const expectedNormalized = normalizeCode(expectedCode);

    // Check for exact match first
    if (userNormalized === expectedNormalized) {
      return true;
    }

    // For SQL, be more strict about structure and syntax
    if (language === 'sql') {
      return evaluateSQLAnswer(userNormalized, expectedNormalized);
    }

    // For other languages, check if user code contains key elements from expected answer
    return evaluateGeneralCodeAnswer(userNormalized, expectedNormalized);
  };

  const evaluateSQLAnswer = (userCode: string, expectedCode: string): boolean => {
    // Add null checks to prevent errors
    if (!userCode || !expectedCode) {
      return false;
    }
    
    // Check basic SQL structure requirements
    const expectedWords = expectedCode.split(/\s+/).filter(word => word.length > 1);
    const userWords = userCode.split(/\s+/);

    // For UPDATE queries
    if (expectedCode.includes('update')) {
      // Must have: UPDATE, SET, WHERE
      const requiredKeywords = ['update', 'set', 'where'];
      const hasAllKeywords = requiredKeywords.every(keyword => 
        userCode.includes(keyword)
      );
      
      if (!hasAllKeywords) {
        return false;
      }

      // Check for table name
      const expectedTableMatch = expectedCode.match(/update\s+(\w+)/);
      const userTableMatch = userCode.match(/update\s+(\w+)/);
      
      if (expectedTableMatch && userTableMatch) {
        const expectedTable = expectedTableMatch[1];
        const userTable = userTableMatch[1];
        // Table names should match (case insensitive)
        if (expectedTable !== userTable) {
          return false;
        }
      }

      // Check for SET clause structure
      if (!userCode.includes('set') || !userCode.match(/set\s+\w+\s*=\s*\w+/)) {
        return false;
      }

      // Check for WHERE clause structure  
      if (!userCode.includes('where') || !userCode.match(/where\s+\w+\s*=\s*\w+/)) {
        return false;
      }
    }

    // For SELECT queries
    else if (expectedCode.includes('select')) {
      if (!userCode.includes('select') || !userCode.includes('from')) {
        return false;
      }
    }

    // For INSERT queries
    else if (expectedCode.includes('insert')) {
      if (!userCode.includes('insert') || !userCode.includes('into')) {
        return false;
      }
    }

    // For DELETE queries
    else if (expectedCode.includes('delete')) {
      if (!userCode.includes('delete') || !userCode.includes('from')) {
        return false;
      }
    }

    // Check if at least 80% of important words match
    const importantWords = expectedWords.filter(word => 
      !['the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with'].includes(word)
    );
    
    const matchingWords = importantWords.filter(word => 
      userWords.some(userWord => userWord === word || userWord.includes(word))
    );

    return matchingWords.length / importantWords.length >= 0.8;
  };

  const evaluateGeneralCodeAnswer = (userCode: string, expectedCode: string): boolean => {
    // Add null checks to prevent errors
    if (!userCode || !expectedCode) {
      return false;
    }
    
    const expectedWords = expectedCode.split(/\s+/).filter(word => word.length > 2);
    const userWords = userCode.split(/\s+/);
    
    // Filter out common words that don't affect logic
    const importantWords = expectedWords.filter(word => 
      !['the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'var', 'let', 'const'].includes(word)
    );
    
    const matchingWords = importantWords.filter(word => 
      userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
    );

    // Require at least 85% match for non-SQL code and substantial content
    return matchingWords.length / importantWords.length >= 0.85 && userCode.length > 15;
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = async () => {
    const timeTaken = Date.now() - timeStarted.getTime();
    const correctAnswers = quiz.questions.filter((question, index) => {
      if (question.questionType === 'code-input') {
        const userCode = textAnswers[index] || '';
        const expectedCode = question.expectedAnswer || '';
        return evaluateCodeAnswer(userCode, expectedCode, question.codeLanguage || 'javascript');
      } else {
        return selectedAnswers[index] === question.correctAnswer;
      }
    }).length;

    const result: QuizResult = {
      quizId: quiz.id,
      score: (correctAnswers / quiz.questions.length) * 100,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeTaken,
      answers: quiz.questions.map((question, index) => ({
        questionId: question.id,
        selectedAnswer: question.questionType === 'code-input' ? undefined : selectedAnswers[index],
        textAnswer: question.questionType === 'code-input' ? (textAnswers[index] || '') : undefined,
        isCorrect: question.questionType === 'code-input' 
          ? evaluateCodeAnswer(textAnswers[index] || '', question.expectedAnswer || '', question.codeLanguage || 'javascript')
          : selectedAnswers[index] === question.correctAnswer,
      })),
      completedAt: new Date(),
    };

    // Save quiz score to backend API
    if (user?.id) {
      try {
        // Save quiz score
        await AuthService.saveQuizScore(user.id, result);
        console.log('Quiz score saved successfully');
        
        // Save complete quiz details with questions and answers
        await AuthService.saveQuizDetails(quiz, result, user.id);
        console.log('Quiz details saved successfully');
      } catch (error) {
        console.error('Failed to save quiz data:', error);
        // Continue with normal flow even if API call fails
      }
    }

    onQuizComplete(result);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  };

  const getTimeElapsed = () => {
    const elapsed = Date.now() - timeStarted.getTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAceEditorSettings = () => ({
    ...getAceEditorOptions(),
    mode: getAceMode(currentQuestion.codeLanguage || 'javascript'),
    theme: 'github',
    value: textAnswers[currentQuestionIndex] || '',
    onChange: handleTextAnswerChange,
    onLoad: handleCodeEditorLoad,
    name: `code-editor-${currentQuestionIndex}`,
    editorProps: { $blockScrolling: true },
    width: '100%',
    height: '200px',
    style: {
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    }
  });

  const renderQuestion = () => {
    if (currentQuestion.questionType === 'code-input') {
      return (
        <Box>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {currentQuestion.question}
          </Typography>
          
          {currentQuestion.codeSnippet && (
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Code to analyze:
              </Typography>
              <SyntaxHighlighter
                language={currentQuestion.codeLanguage || 'javascript'}
                style={tomorrow}
                customStyle={{
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                {currentQuestion.codeSnippet}
              </SyntaxHighlighter>
            </Box>
          )}
          
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Your answer:
            </Typography>
            <AceEditor {...getAceEditorSettings()} />
          </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              💡 Tip: Write clean, readable code by yourself. Copy/paste operations are disabled to ensure you demonstrate your actual coding skills. Consider edge cases, best practices, and make sure your syntax is correct.
            </Typography>
          </Alert>
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography variant="h6" fontWeight={600} mb={2}>
            {currentQuestion.question}
          </Typography>
          
          {currentQuestion.codeSnippet && (
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Code snippet:
              </Typography>
              <SyntaxHighlighter
                language={currentQuestion.codeLanguage || 'javascript'}
                style={tomorrow}
                customStyle={{
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                {currentQuestion.codeSnippet}
              </SyntaxHighlighter>
            </Box>
          )}
          
          <Stack spacing={2} mb={4}>
            {currentQuestion.options.map((option, index) => (
              <Paper
                key={index}
                elevation={selectedAnswers[currentQuestionIndex] === index ? 6 : 1}
                sx={{
                  p: 2,
                  border: selectedAnswers[currentQuestionIndex] === index ? '2px solid #2563eb' : '1px solid #e0e0e0',
                  bgcolor: selectedAnswers[currentQuestionIndex] === index ? '#e3edfa' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => handleAnswerSelect(index)}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: selectedAnswers[currentQuestionIndex] === index ? '#2563eb' : '#bdbdbd',
                      bgcolor: selectedAnswers[currentQuestionIndex] === index ? '#2563eb' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'white' }} />
                    )}
                  </Box>
                  <Typography variant="body1">{option}</Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      );
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="60vh">
      <Card sx={{ width: '100%', maxWidth: 700, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Button onClick={onBack} startIcon={<ArrowLeft />} variant="outlined" color="inherit">
              Back
            </Button>
            <Stack direction="row" spacing={3} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {getTimeElapsed()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Typography>
            </Stack>
          </Stack>

          <Box mb={3}>
            <LinearProgress variant="determinate" value={getProgressPercentage()} sx={{ height: 8, borderRadius: 5 }} />
          </Box>

          {renderQuestion()}

          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outlined"
              color="inherit"
              startIcon={<ArrowLeft />}
            >
              Previous
            </Button>
            {isLastQuestion ? (
              <Button
                onClick={handleFinish}
                disabled={!hasAnsweredCurrent}
                variant="contained"
                color="primary"
                endIcon={<Trophy />}
              >
                Finish Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
                variant="contained"
                color="primary"
                endIcon={<ArrowRight />}
              >
                Next
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}; 