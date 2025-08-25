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
  // Core Programming Languages
  'JavaScript' | 'TypeScript' | 'Python' | 'Java' | 'C#' | 'C++' | 'C' | 'PHP' | 'Ruby' | 'Go' | 'Rust' | 'Swift' | 'Kotlin' | 'Scala' | 'R' | 'Perl' | 'Dart' | 'Elixir' | 'Haskell' | 'F#' |
  // Web Technologies
  'HTML' | 'CSS' | 'SASS' | 'LESS' | 'Bootstrap' | 'Tailwind CSS' | 'jQuery' | 'AJAX' | 'WebAssembly' |
  // Frontend Frameworks & Libraries
  'React' | 'Angular' | 'Vue.js' | 'Svelte' | 'Next.js' | 'Nuxt.js' | 'Gatsby' | 'Ember.js' | 'Alpine.js' |
  // Backend Frameworks
  'Node.js' | 'Express.js' | 'Django' | 'Flask' | 'FastAPI' | 'Spring Boot' | 'ASP.NET Core' | '.NET' | 'Ruby on Rails' | 'Laravel' | 'Symphony' | 'Gin' | 'Echo' | 'Actix' |
  // Mobile Development
  'React Native' | 'Flutter' | 'Ionic' | 'Xamarin' | 'Cordova' | 'NativeScript' |
  // Databases
  'SQL' | 'MySQL' | 'PostgreSQL' | 'SQL Server' | 'Oracle' | 'SQLite' | 'MongoDB' | 'Redis' | 'Cassandra' | 'DynamoDB' | 'Neo4j' | 'CouchDB' |
  // Cloud & DevOps
  'AWS' | 'Azure' | 'Google Cloud' | 'Docker' | 'Kubernetes' | 'Jenkins' | 'GitLab CI' | 'GitHub Actions' | 'Terraform' | 'Ansible' |
  // Data Science & AI
  'Machine Learning' | 'Deep Learning' | 'TensorFlow' | 'PyTorch' | 'Pandas' | 'NumPy' | 'Scikit-learn' | 'Jupyter' |
  // Testing
  'Jest' | 'Cypress' | 'Selenium' | 'JUnit' | 'PyTest' | 'Mocha' | 'Chai' | 'Testing Library' |
  // Version Control & Tools
  'Git' | 'GitHub' | 'GitLab' | 'Bitbucket' | 'SVN' | 'Webpack' | 'Vite' | 'Parcel' | 'ESLint' | 'Prettier' |
  // Other Technologies
  'GraphQL' | 'REST API' | 'Microservices' | 'Blockchain' | 'Solidity' | 'Unity' | 'Unreal Engine' | 'Arduino' | 'Raspberry Pi';

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
  // Core Programming Languages
  'JavaScript': { name: 'JavaScript', description: 'Dynamic web programming language', codeLanguage: 'javascript' },
  'TypeScript': { name: 'TypeScript', description: 'JavaScript with static type definitions', codeLanguage: 'typescript' },
  'Python': { name: 'Python', description: 'Versatile high-level programming language', codeLanguage: 'python' },
  'Java': { name: 'Java', description: 'Object-oriented programming language', codeLanguage: 'java' },
  'C#': { name: 'C#', description: 'Microsoft .NET programming language', codeLanguage: 'csharp' },
  'C++': { name: 'C++', description: 'Systems programming language', codeLanguage: 'cpp' },
  'C': { name: 'C', description: 'Low-level programming language', codeLanguage: 'c' },
  'PHP': { name: 'PHP', description: 'Server-side scripting language', codeLanguage: 'php' },
  'Ruby': { name: 'Ruby', description: 'Dynamic object-oriented language', codeLanguage: 'ruby' },
  'Go': { name: 'Go', description: 'Google\'s systems programming language', codeLanguage: 'go' },
  'Rust': { name: 'Rust', description: 'Memory-safe systems programming', codeLanguage: 'rust' },
  'Swift': { name: 'Swift', description: 'Apple\'s programming language', codeLanguage: 'swift' },
  'Kotlin': { name: 'Kotlin', description: 'Modern JVM programming language', codeLanguage: 'kotlin' },
  'Scala': { name: 'Scala', description: 'Functional and object-oriented language', codeLanguage: 'scala' },
  'R': { name: 'R', description: 'Statistical computing language', codeLanguage: 'r' },
  'Perl': { name: 'Perl', description: 'Text processing programming language', codeLanguage: 'perl' },
  'Dart': { name: 'Dart', description: 'Google\'s client-optimized language', codeLanguage: 'dart' },
  'Elixir': { name: 'Elixir', description: 'Functional concurrent programming', codeLanguage: 'elixir' },
  'Haskell': { name: 'Haskell', description: 'Pure functional programming language', codeLanguage: 'haskell' },
  'F#': { name: 'F#', description: 'Functional-first .NET language', codeLanguage: 'fsharp' },

  // Web Technologies
  'HTML': { name: 'HTML', description: 'HyperText Markup Language', codeLanguage: 'html' },
  'CSS': { name: 'CSS', description: 'Cascading Style Sheets', codeLanguage: 'css' },
  'SASS': { name: 'SASS', description: 'Syntactically Awesome Style Sheets', codeLanguage: 'scss' },
  'LESS': { name: 'LESS', description: 'Dynamic CSS preprocessor', codeLanguage: 'less' },
  'Bootstrap': { name: 'Bootstrap', description: 'CSS framework for responsive design', codeLanguage: 'css' },
  'Tailwind CSS': { name: 'Tailwind CSS', description: 'Utility-first CSS framework', codeLanguage: 'css' },
  'jQuery': { name: 'jQuery', description: 'JavaScript library for DOM manipulation', codeLanguage: 'javascript' },
  'AJAX': { name: 'AJAX', description: 'Asynchronous JavaScript and XML', codeLanguage: 'javascript' },
  'WebAssembly': { name: 'WebAssembly', description: 'Binary instruction format for web', codeLanguage: 'wasm' },

  // Frontend Frameworks & Libraries
  'React': { name: 'React', description: 'Facebook\'s UI library for JavaScript', codeLanguage: 'javascript' },
  'Angular': { name: 'Angular', description: 'Google\'s TypeScript web framework', codeLanguage: 'typescript' },
  'Vue.js': { name: 'Vue.js', description: 'Progressive JavaScript framework', codeLanguage: 'javascript' },
  'Svelte': { name: 'Svelte', description: 'Compile-time JavaScript framework', codeLanguage: 'javascript' },
  'Next.js': { name: 'Next.js', description: 'React framework for production', codeLanguage: 'javascript' },
  'Nuxt.js': { name: 'Nuxt.js', description: 'Vue.js framework for applications', codeLanguage: 'javascript' },
  'Gatsby': { name: 'Gatsby', description: 'React-based static site generator', codeLanguage: 'javascript' },
  'Ember.js': { name: 'Ember.js', description: 'Ambitious web application framework', codeLanguage: 'javascript' },
  'Alpine.js': { name: 'Alpine.js', description: 'Lightweight JavaScript framework', codeLanguage: 'javascript' },

  // Backend Frameworks
  'Node.js': { name: 'Node.js', description: 'JavaScript runtime for server-side', codeLanguage: 'javascript' },
  'Express.js': { name: 'Express.js', description: 'Minimal Node.js web framework', codeLanguage: 'javascript' },
  'Django': { name: 'Django', description: 'High-level Python web framework', codeLanguage: 'python' },
  'Flask': { name: 'Flask', description: 'Lightweight Python web framework', codeLanguage: 'python' },
  'FastAPI': { name: 'FastAPI', description: 'Modern Python web API framework', codeLanguage: 'python' },
  'Spring Boot': { name: 'Spring Boot', description: 'Java framework for microservices', codeLanguage: 'java' },
  'ASP.NET Core': { name: 'ASP.NET Core', description: 'Cross-platform .NET web framework', codeLanguage: 'csharp' },
  '.NET': { name: '.NET', description: 'Microsoft development platform', codeLanguage: 'csharp' },
  'Ruby on Rails': { name: 'Ruby on Rails', description: 'Ruby web application framework', codeLanguage: 'ruby' },
  'Laravel': { name: 'Laravel', description: 'PHP web application framework', codeLanguage: 'php' },
  'Symphony': { name: 'Symphony', description: 'PHP web application framework', codeLanguage: 'php' },
  'Gin': { name: 'Gin', description: 'Go web framework', codeLanguage: 'go' },
  'Echo': { name: 'Echo', description: 'High performance Go web framework', codeLanguage: 'go' },
  'Actix': { name: 'Actix', description: 'Rust web framework', codeLanguage: 'rust' },

  // Mobile Development
  'React Native': { name: 'React Native', description: 'Cross-platform mobile development', codeLanguage: 'javascript' },
  'Flutter': { name: 'Flutter', description: 'Google\'s UI toolkit for mobile', codeLanguage: 'dart' },
  'Ionic': { name: 'Ionic', description: 'Hybrid mobile app framework', codeLanguage: 'javascript' },
  'Xamarin': { name: 'Xamarin', description: 'Microsoft\'s mobile development platform', codeLanguage: 'csharp' },
  'Cordova': { name: 'Cordova', description: 'Mobile app development framework', codeLanguage: 'javascript' },
  'NativeScript': { name: 'NativeScript', description: 'Native mobile apps with JS/TS', codeLanguage: 'javascript' },

  // Databases
  'SQL': { name: 'SQL', description: 'Structured Query Language', codeLanguage: 'sql' },
  'MySQL': { name: 'MySQL', description: 'Popular open-source database', codeLanguage: 'sql' },
  'PostgreSQL': { name: 'PostgreSQL', description: 'Advanced open-source database', codeLanguage: 'sql' },
  'SQL Server': { name: 'SQL Server', description: 'Microsoft relational database', codeLanguage: 'sql' },
  'Oracle': { name: 'Oracle', description: 'Enterprise database management', codeLanguage: 'sql' },
  'SQLite': { name: 'SQLite', description: 'Lightweight embedded database', codeLanguage: 'sql' },
  'MongoDB': { name: 'MongoDB', description: 'Document-oriented NoSQL database', codeLanguage: 'javascript' },
  'Redis': { name: 'Redis', description: 'In-memory data structure store', codeLanguage: 'text' },
  'Cassandra': { name: 'Cassandra', description: 'Distributed NoSQL database', codeLanguage: 'text' },
  'DynamoDB': { name: 'DynamoDB', description: 'Amazon\'s NoSQL database service', codeLanguage: 'text' },
  'Neo4j': { name: 'Neo4j', description: 'Graph database management system', codeLanguage: 'cypher' },
  'CouchDB': { name: 'CouchDB', description: 'Document-oriented NoSQL database', codeLanguage: 'javascript' },

  // Cloud & DevOps
  'AWS': { name: 'AWS', description: 'Amazon Web Services cloud platform', codeLanguage: 'yaml' },
  'Azure': { name: 'Azure', description: 'Microsoft cloud computing platform', codeLanguage: 'yaml' },
  'Google Cloud': { name: 'Google Cloud', description: 'Google\'s cloud computing services', codeLanguage: 'yaml' },
  'Docker': { name: 'Docker', description: 'Containerization platform', codeLanguage: 'dockerfile' },
  'Kubernetes': { name: 'Kubernetes', description: 'Container orchestration system', codeLanguage: 'yaml' },
  'Jenkins': { name: 'Jenkins', description: 'Automation server for CI/CD', codeLanguage: 'groovy' },
  'GitLab CI': { name: 'GitLab CI', description: 'GitLab\'s CI/CD solution', codeLanguage: 'yaml' },
  'GitHub Actions': { name: 'GitHub Actions', description: 'GitHub\'s CI/CD workflows', codeLanguage: 'yaml' },
  'Terraform': { name: 'Terraform', description: 'Infrastructure as Code tool', codeLanguage: 'hcl' },
  'Ansible': { name: 'Ansible', description: 'IT automation and configuration', codeLanguage: 'yaml' },

  // Data Science & AI
  'Machine Learning': { name: 'Machine Learning', description: 'AI and predictive modeling', codeLanguage: 'python' },
  'Deep Learning': { name: 'Deep Learning', description: 'Neural networks and AI', codeLanguage: 'python' },
  'TensorFlow': { name: 'TensorFlow', description: 'Google\'s machine learning library', codeLanguage: 'python' },
  'PyTorch': { name: 'PyTorch', description: 'Facebook\'s machine learning library', codeLanguage: 'python' },
  'Pandas': { name: 'Pandas', description: 'Python data manipulation library', codeLanguage: 'python' },
  'NumPy': { name: 'NumPy', description: 'Python numerical computing library', codeLanguage: 'python' },
  'Scikit-learn': { name: 'Scikit-learn', description: 'Python machine learning library', codeLanguage: 'python' },
  'Jupyter': { name: 'Jupyter', description: 'Interactive computing notebooks', codeLanguage: 'python' },

  // Testing
  'Jest': { name: 'Jest', description: 'JavaScript testing framework', codeLanguage: 'javascript' },
  'Cypress': { name: 'Cypress', description: 'End-to-end testing framework', codeLanguage: 'javascript' },
  'Selenium': { name: 'Selenium', description: 'Web application testing framework', codeLanguage: 'java' },
  'JUnit': { name: 'JUnit', description: 'Java unit testing framework', codeLanguage: 'java' },
  'PyTest': { name: 'PyTest', description: 'Python testing framework', codeLanguage: 'python' },
  'Mocha': { name: 'Mocha', description: 'JavaScript test framework', codeLanguage: 'javascript' },
  'Chai': { name: 'Chai', description: 'JavaScript assertion library', codeLanguage: 'javascript' },
  'Testing Library': { name: 'Testing Library', description: 'React component testing utilities', codeLanguage: 'javascript' },

  // Version Control & Tools
  'Git': { name: 'Git', description: 'Distributed version control system', codeLanguage: 'bash' },
  'GitHub': { name: 'GitHub', description: 'Git repository hosting service', codeLanguage: 'markdown' },
  'GitLab': { name: 'GitLab', description: 'Web-based Git repository manager', codeLanguage: 'markdown' },
  'Bitbucket': { name: 'Bitbucket', description: 'Atlassian\'s Git repository service', codeLanguage: 'markdown' },
  'SVN': { name: 'SVN', description: 'Subversion version control system', codeLanguage: 'text' },
  'Webpack': { name: 'Webpack', description: 'JavaScript module bundler', codeLanguage: 'javascript' },
  'Vite': { name: 'Vite', description: 'Fast build tool for modern web', codeLanguage: 'javascript' },
  'Parcel': { name: 'Parcel', description: 'Zero-configuration build tool', codeLanguage: 'javascript' },
  'ESLint': { name: 'ESLint', description: 'JavaScript code quality tool', codeLanguage: 'javascript' },
  'Prettier': { name: 'Prettier', description: 'Code formatting tool', codeLanguage: 'javascript' },

  // Other Technologies
  'GraphQL': { name: 'GraphQL', description: 'Query language for APIs', codeLanguage: 'graphql' },
  'REST API': { name: 'REST API', description: 'RESTful web service architecture', codeLanguage: 'json' },
  'Microservices': { name: 'Microservices', description: 'Distributed system architecture', codeLanguage: 'yaml' },
  'Blockchain': { name: 'Blockchain', description: 'Distributed ledger technology', codeLanguage: 'javascript' },
  'Solidity': { name: 'Solidity', description: 'Ethereum smart contract language', codeLanguage: 'solidity' },
  'Unity': { name: 'Unity', description: 'Game development platform', codeLanguage: 'csharp' },
  'Unreal Engine': { name: 'Unreal Engine', description: 'Game development engine', codeLanguage: 'cpp' },
  'Arduino': { name: 'Arduino', description: 'Microcontroller programming platform', codeLanguage: 'cpp' },
  'Raspberry Pi': { name: 'Raspberry Pi', description: 'Single-board computer programming', codeLanguage: 'python' }
};