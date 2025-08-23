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
    const { topic, difficulty, numQuestions, questionType } = settings;
    const topicInfo = SOFTWARE_TOPICS[topic];
    
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

    return `Generate a ${difficulty} level quiz about "${topicInfo.name}" for software engineers with ${numQuestions} questions.
Question type: ${questionTypeDescription}

For ${topicInfo.name} topics, include:
${this.getTopicSpecificRequirements(topic)}

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
      "codeLanguage": "${topicInfo.codeLanguage}",
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
- Focus specifically on ${topicInfo.description} for software engineers
- For code-input questions, set options to [] and correctAnswer to -1
- For code-input questions, provide expectedAnswer for evaluation but DO NOT display it to users
- Make expectedAnswer comprehensive to allow for multiple valid solutions

Generate exactly ${numQuestions} questions.`;
  }

  private getTopicSpecificRequirements(topic: SoftwareEngineeringTopic): string {
    switch (topic) {
      case 'HTML':
        return `- HTML elements, attributes, semantic markup
- Form elements and validation
- HTML5 features and APIs
- Accessibility (a11y) best practices
- DOM structure and manipulation`;
      case 'Python':
        return `- Python syntax, data structures, and algorithms
- Object-oriented programming concepts
- Built-in functions and libraries
- Error handling and debugging
- Code optimization and best practices`;
      case '.NET':
        return `- .NET Framework and .NET Core concepts
- ASP.NET Web API and MVC
- Entity Framework and data access
- Dependency injection and middleware
- Performance optimization`;
      case 'C#':
        return `- C# language features and syntax
- Object-oriented programming
- LINQ and lambda expressions
- Async/await and task-based programming
- Memory management and garbage collection`;
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
      default:
        return `- Core concepts and best practices
- Common patterns and implementations
- Problem-solving and debugging
- Performance considerations`;
    }
  }
}

export const geminiService = new GeminiService();