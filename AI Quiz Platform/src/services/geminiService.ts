import { GoogleGenerativeAI } from '@google/generative-ai';
import type { QuizSettings, GeminiResponse, SoftwareEngineeringTopic } from '../types/quiz';
import { SOFTWARE_TOPICS } from '../types/quiz';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateQuiz(settings: QuizSettings): Promise<GeminiResponse> {
    try {
      const prompt = this.buildPrompt(settings);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini API');
      }
      const quizData = JSON.parse(jsonMatch[1]);
      return quizData;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error('Failed to generate quiz. Please try again.');
    }
  }

  private buildPrompt(settings: QuizSettings): string {
    const { topics, difficulty, numQuestions, questionType } = settings;
    
    // Combine topics information
    const topicsInfo = topics.map(topic => SOFTWARE_TOPICS[topic]);
    const topicsNames = topicsInfo.map(info => info.name).join(' & ');
    const topicsDescriptions = topicsInfo.map(info => info.description).join(', ');
    const primaryCodeLanguage = topicsInfo[0]?.codeLanguage || 'text';
    
    let questionTypeDescription = '';
    switch (questionType) {
      case 'mixed':
        questionTypeDescription = 'Mix of multiple-choice and code-input questions (50% each approximately)';
        break;
      case 'code-input':
        questionTypeDescription = 'Code input questions where users need to write code or SQL queries';
        break;
      case 'multiple-choice':
        questionTypeDescription = 'Multiple choice questions';
        break;
      case 'true-false':
        questionTypeDescription = 'True/False questions';
        break;
    }

    return `Generate a ${difficulty} level quiz about "${topicsNames}" for software engineers with ${numQuestions} questions.
Question type: ${questionTypeDescription}

For the selected topics (${topicsNames}), include:
${this.getMultipleTopicsRequirements(topics)}

Please provide the response in the following JSON format:

\`\`\`json
{
  "questions": [
    {
      "question": "Your question here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is the correct answer",
      "questionType": "multiple-choice",
      "codeSnippet": "// Optional: code snippet to analyze",
      "codeLanguage": "${primaryCodeLanguage}",
      "expectedAnswer": "// For code-input questions: expected code/query - DO NOT show this to users"
    }
  ]
}
\`\`\`

Requirements:
- For multiple-choice questions: Make questions engaging and educational with plausible options
- For code-input questions: Ask users to write actual code, fix bugs, or complete functions
- For SQL questions: Ask users to write queries for specific database operations
- Use 0-based indexing for correctAnswer (0 = first option, 1 = second option, etc.)
- For true-false questions, use ["True", "False"] as options
- Include code snippets when relevant for analysis
- Make sure the difficulty level matches: ${difficulty}
- Focus specifically on ${topicsDescriptions} for software engineers
- For code-input questions, set options to [] and correctAnswer to -1
- For code-input questions, provide expectedAnswer for evaluation but DO NOT display it to users
- Make expectedAnswer comprehensive to allow for multiple valid solutions
- Mix questions across the selected topics: ${topicsNames}
- Ensure questions cover different aspects of each selected topic

Generate exactly ${numQuestions} questions.`;
  }

  private getMultipleTopicsRequirements(topics: SoftwareEngineeringTopic[]): string {
    const requirements = topics.map(topic => {
      const topicInfo = SOFTWARE_TOPICS[topic];
      return `\n${topicInfo.name}:\n${this.getTopicSpecificRequirements(topic)}`;
    });
    return requirements.join('\n');
  }

  private getTopicSpecificRequirements(topic: SoftwareEngineeringTopic): string {
    switch (topic) {
      // Languages
      case 'HTML':
        return `- HTML elements, attributes, semantic markup
- Form elements and validation
- HTML5 features and APIs
- Accessibility (a11y) best practices
- DOM structure and manipulation`;
      case 'C#':
        return `- C# language features and syntax
- Object-oriented programming
- LINQ and lambda expressions
- Async/await and task-based programming
- Memory management and garbage collection`;
      case 'JavaScript':
        return `- JavaScript syntax, data types, and functions
- DOM manipulation and event handling
- Asynchronous programming (Promises, async/await)
- ES6+ features and modern JavaScript
- Browser APIs and web development`;
      case 'TypeScript':
        return `- TypeScript type system and interfaces
- Generics and advanced types
- Decorators and metadata
- TypeScript configuration and compilation
- Integration with JavaScript frameworks`;
      case 'Python':
        return `- Python syntax, data structures, and algorithms
- Object-oriented programming concepts
- Built-in functions and libraries
- Error handling and debugging
- Code optimization and best practices`;
      case 'Java':
        return `- Java syntax and object-oriented principles
- Collections framework and data structures
- Exception handling and multithreading
- JVM concepts and memory management
- Design patterns and best practices`;
      case 'Go':
        return `- Go syntax and language features
- Goroutines and channels for concurrency
- Package management and modules
- Error handling and testing
- Performance optimization and best practices`;
      case 'Rust':
        return `- Rust ownership and borrowing system
- Memory safety without garbage collection
- Pattern matching and enums
- Concurrency and async programming
- Cargo package manager and tooling`;

      // Frameworks / Frontend
      case 'React':
        return `- React components and JSX syntax
- State management and hooks
- Component lifecycle and effects
- Event handling and forms
- React Router and modern patterns`;
      case 'Angular':
        return `- Angular components and templates
- Services and dependency injection
- RxJS and observables
- Angular CLI and routing
- Forms and HTTP client`;
      case 'Vue.js':
        return `- Vue.js components and templates
- Reactivity system and computed properties
- Vue Router and state management
- Component communication and props
- Vue CLI and build tools`;
      case 'ASP.NET Core':
        return `- ASP.NET Core MVC and Web API
- Dependency injection and middleware
- Entity Framework Core
- Authentication and authorization
- Performance and deployment`;
      case 'Django':
        return `- Django models, views, and templates
- URL routing and forms
- Django ORM and database operations
- Authentication and user management
- Django REST framework`;
      case 'Spring Boot':
        return `- Spring Boot configuration and auto-configuration
- Spring MVC and REST controllers
- Spring Data and JPA
- Security and authentication
- Testing and deployment`;
      case '.NET':
        return `- .NET Framework and .NET Core concepts
- ASP.NET Web API and MVC
- Entity Framework and data access
- Dependency injection and middleware
- Performance optimization`;

      // Databases
      case 'SQL':
        return `- SELECT, INSERT, UPDATE, DELETE operations with proper syntax
- JOIN operations and subqueries with correct table references
- WHERE clauses with proper conditions
- Correct table and column names
- Proper SQL keywords and structure
- Indexing and query optimization concepts
- Stored procedures and functions
- Database design and normalization
- Ensure SQL queries are syntactically correct and complete`;
      case 'SQL Server':
        return `- T-SQL syntax and features
- Stored procedures and functions
- Indexing and performance tuning
- Backup and recovery strategies
- Security and user management
- Integration Services (SSIS)`;
      case 'PostgreSQL':
        return `- PostgreSQL-specific features and syntax
- Advanced data types and functions
- Indexing and query optimization
- JSONB and NoSQL features
- Extensions and custom functions
- Replication and backup strategies`;
      case 'MySQL':
        return `- MySQL syntax and features
- Storage engines (InnoDB, MyISAM)
- Indexing and query optimization
- Replication and clustering
- Performance tuning and monitoring
- Backup and recovery procedures`;
      case 'MongoDB':
        return `- MongoDB document structure and BSON
- CRUD operations and queries
- Aggregation framework and pipelines
- Indexing and performance optimization
- Replica sets and sharding
- Schema design for NoSQL`;
      case 'Oracle':
        return `- Oracle SQL and PL/SQL
- Database objects and schema design
- Performance tuning and optimization
- Backup and recovery strategies
- Security and user management
- Oracle-specific features and functions`;
      case 'SQLite':
        return `- SQLite syntax and limitations
- Embedded database concepts
- File-based database operations
- Performance considerations
- Backup and data export/import
- Integration with applications`;
      default:
        return `- Core concepts and best practices
- Common patterns and implementations
- Problem-solving and debugging
- Performance considerations`;
    }
  }
}

export const geminiService = new GeminiService();