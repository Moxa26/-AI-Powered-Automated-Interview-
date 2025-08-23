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
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdAt: Date;
}

export type SoftwareEngineeringTopic = 
  // Languages
  'HTML' | 'C#' | 'JavaScript' | 'TypeScript' | 'Python' | 'Java' | 'Go' | 'Rust' |
  // Frameworks / Frontend
  'React' | 'Angular' | 'Vue.js' | 'ASP.NET Core' | 'Django' | 'Spring Boot' | '.NET' |
  // Databases
  'SQL' | 'SQL Server' | 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'Oracle' | 'SQLite';

export interface QuizSettings {
  topics: SoftwareEngineeringTopic[];
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
  // Languages
  'HTML': { name: 'HTML', description: 'HyperText Markup Language', codeLanguage: 'html' },
  'C#': { name: 'C#', description: 'C# Programming Language', codeLanguage: 'csharp' },
  'JavaScript': { name: 'JavaScript', description: 'JavaScript Programming Language', codeLanguage: 'javascript' },
  'TypeScript': { name: 'TypeScript', description: 'TypeScript - JavaScript with Types', codeLanguage: 'typescript' },
  'Python': { name: 'Python', description: 'Python Programming Language', codeLanguage: 'python' },
  'Java': { name: 'Java', description: 'Java Programming Language', codeLanguage: 'java' },
  'Go': { name: 'Go', description: 'Go Programming Language', codeLanguage: 'go' },
  'Rust': { name: 'Rust', description: 'Rust Programming Language', codeLanguage: 'rust' },
  
  // Frameworks / Frontend
  'React': { name: 'React', description: 'React JavaScript Library', codeLanguage: 'javascript' },
  'Angular': { name: 'Angular', description: 'Angular TypeScript Framework', codeLanguage: 'typescript' },
  'Vue.js': { name: 'Vue.js', description: 'Vue.js Progressive Framework', codeLanguage: 'javascript' },
  'ASP.NET Core': { name: 'ASP.NET Core', description: 'ASP.NET Core Web Framework', codeLanguage: 'csharp' },
  'Django': { name: 'Django', description: 'Django Python Web Framework', codeLanguage: 'python' },
  'Spring Boot': { name: 'Spring Boot', description: 'Spring Boot Java Framework', codeLanguage: 'java' },
  '.NET': { name: '.NET', description: '.NET Framework and Core', codeLanguage: 'csharp' },
  
  // Databases
  'SQL': { name: 'SQL', description: 'Structured Query Language', codeLanguage: 'sql' },
  'SQL Server': { name: 'SQL Server', description: 'Microsoft SQL Server Database', codeLanguage: 'sql' },
  'PostgreSQL': { name: 'PostgreSQL', description: 'PostgreSQL Database', codeLanguage: 'sql' },
  'MySQL': { name: 'MySQL', description: 'MySQL Database', codeLanguage: 'sql' },
  'MongoDB': { name: 'MongoDB', description: 'MongoDB NoSQL Database', codeLanguage: 'javascript' },
  'Oracle': { name: 'Oracle', description: 'Oracle Database', codeLanguage: 'sql' },
  'SQLite': { name: 'SQLite', description: 'SQLite Lightweight Database', codeLanguage: 'sql' }
};