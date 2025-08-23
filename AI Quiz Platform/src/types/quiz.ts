export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  questionType: 'multiple-choice' | 'code-input' | 'true-false';
  codeSnippet?: string;
  codeLanguage?: string;
  userAnswer?: string; // For text input answers
  expectedAnswer?: string; // For code evaluation (not displayed to users)
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdAt: Date;
}

export type SoftwareEngineeringTopic = 'HTML' | 'Python' | '.NET' | 'C#' | 'SQL';

export interface QuizSettings {
  topic: SoftwareEngineeringTopic;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  questionType: 'multiple-choice' | 'code-input' | 'true-false' | 'mixed';
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: {
    questionId: string;
    selectedAnswer?: number; // For multiple choice
    textAnswer?: string; // For code input
    isCorrect: boolean;
  }[];
  completedAt: Date;
}

export interface GeminiResponse {
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    questionType: 'multiple-choice' | 'code-input' | 'true-false';
    codeSnippet?: string;
    codeLanguage?: string;
    expectedAnswer?: string; // For code input questions
  }[];
}

// Software Engineering Topics Configuration
export const SOFTWARE_TOPICS: Record<SoftwareEngineeringTopic, { name: string; description: string; codeLanguage: string }> = {
  'HTML': { name: 'HTML', description: 'HyperText Markup Language', codeLanguage: 'html' },
  'Python': { name: 'Python', description: 'Python Programming Language', codeLanguage: 'python' },
  '.NET': { name: '.NET', description: '.NET Framework and Core', codeLanguage: 'csharp' },
  'C#': { name: 'C#', description: 'C# Programming Language', codeLanguage: 'csharp' },
  'SQL': { name: 'SQL', description: 'Structured Query Language', codeLanguage: 'sql' }
};