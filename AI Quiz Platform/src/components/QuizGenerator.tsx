import { useState } from 'react';
import { Brain, Loader2, Sparkles, Code2 } from 'lucide-react';
import type { QuizSettings, Quiz, SoftwareEngineeringTopic } from '../types/quiz';
import { SOFTWARE_TOPICS } from '../types/quiz';
import { geminiService } from '../services/geminiService';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  Alert,
  InputLabel,
  FormControl,
  Chip,
  SelectChangeEvent,
} from '@mui/material';

interface QuizGeneratorProps {
  onQuizGenerated: (quiz: Quiz) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated }) => {
  const [settings, setSettings] = useState<QuizSettings>({
    topics: ['JavaScript'],
    difficulty: 'medium',
    numQuestions: 5,
    questionType: 'mixed',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof QuizSettings, value: string | number) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleTopicsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const topicsArray = typeof value === 'string' ? value.split(',') : value;
    setSettings((prev) => ({
      ...prev,
      topics: topicsArray as SoftwareEngineeringTopic[],
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.topics || settings.topics.length === 0) {
      setError('Please select at least one topic');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const response = await geminiService.generateQuiz(settings);
      const topicsNames = settings.topics.map(topic => SOFTWARE_TOPICS[topic].name).join(' & ');
      const topicsDescriptions = settings.topics.map(topic => SOFTWARE_TOPICS[topic].description).join(', ');
      const primaryCodeLanguage = SOFTWARE_TOPICS[settings.topics[0]]?.codeLanguage || 'text';
      
      const quiz: Quiz = {
        id: Date.now().toString(),
        title: `${topicsNames} Quiz for Software Engineers`,
        description: `A ${settings.difficulty} level ${topicsDescriptions} quiz for software engineers`,
        topics: settings.topics,
        difficulty: settings.difficulty,
        questions: response.questions.map((q, index) => ({
          id: index.toString(),
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          questionType: q.questionType,
          codeSnippet: q.codeSnippet,
          codeLanguage: q.codeLanguage || primaryCodeLanguage,
          expectedAnswer: q.expectedAnswer, // Store for evaluation but don't display
        })),
        createdAt: new Date(),
      };
      onQuizGenerated(quiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="60vh">
      <Card sx={{ width: '100%', maxWidth: 600, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Box sx={{ p: 1, bgcolor: '#e0e7ff', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
              <Code2 size={28} color="#2563eb" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                Software Engineering Quiz Generator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generate coding quizzes for software engineers
              </Typography>
            </Box>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="topics-label">Programming Topics *</InputLabel>
                <Select
                  labelId="topics-label"
                  multiple
                  value={settings.topics}
                  label="Programming Topics *"
                  onChange={handleTopicsChange}
                  disabled={isGenerating}
                  required
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip 
                          key={value} 
                          label={SOFTWARE_TOPICS[value as SoftwareEngineeringTopic].name}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {Object.entries(SOFTWARE_TOPICS).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Code2 size={16} />
                        <Box>
                          <Typography variant="body1">{value.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {value.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    value={settings.difficulty}
                    label="Difficulty"
                    onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                    disabled={isGenerating}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="numQuestions-label">Questions</InputLabel>
                  <Select
                    labelId="numQuestions-label"
                    value={String(settings.numQuestions)}
                    label="Questions"
                    onChange={(e) => handleInputChange('numQuestions', Number(e.target.value))}
                    disabled={isGenerating}
                  >
                    <MenuItem value={3}>3 Questions</MenuItem>
                    <MenuItem value={5}>5 Questions</MenuItem>
                    <MenuItem value={10}>10 Questions</MenuItem>
                    <MenuItem value={15}>15 Questions</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="questionType-label">Question Type</InputLabel>
                  <Select
                    labelId="questionType-label"
                    value={settings.questionType}
                    label="Question Type"
                    onChange={(e) => handleInputChange('questionType', e.target.value as 'multiple-choice' | 'code-input' | 'true-false' | 'mixed')}
                    disabled={isGenerating}
                  >
                    <MenuItem value="mixed">Mixed (Multiple Choice + Code)</MenuItem>
                    <MenuItem value="multiple-choice">Multiple Choice Only</MenuItem>
                    <MenuItem value="code-input">Code Input Only</MenuItem>
                    <MenuItem value="true-false">True/False Only</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isGenerating || !settings.topics || settings.topics.length === 0}
                startIcon={isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
              >
                {isGenerating ? 'Generating Software Engineering Quiz...' : 'Generate Quiz'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 