# Interview Buzz - AI-Powered Coding Quiz Platform

A modern React TypeScript application that generates and administers coding quizzes using Google's Generative AI. Features include user authentication, quiz generation, quiz taking, and result tracking.

## Features

- 🔐 **User Authentication**: Login and registration system with JWT tokens
- 🤖 **AI Quiz Generation**: Generate quizzes using Google's Gemini AI
- 📝 **Multiple Question Types**: Multiple choice, code input, and true/false questions
- 🎯 **Topic Coverage**: HTML, Python, .NET, C#, and SQL
- 📊 **Quiz Results**: Track performance and review answers
- 🎨 **Modern UI**: Built with Material-UI and Lucide React icons
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **Real API Integration**: Connected to your authentication backend

## Tech Stack

### Frontend
- React 19 with TypeScript
- Material-UI (MUI) for components
- Lucide React for icons
- React Context for state management

### Backend (Your API)
- **Login Endpoint**: `POST /api/login`
- **Request Format**: `{ "username": "string", "password": "string" }`
- **Response**: JWT token and user data
- **Authentication**: Bearer token in Authorization header

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

### Backend Setup (Optional)

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install server dependencies:**
   ```bash
   npm install
   ```

3. **Start the mock server:**
   ```bash
   npm start
   ```
   
   The server will run at `http://localhost:3001`

   **Note:** If you don't start the backend server, the app will automatically fall back to mock authentication functions.

## Usage

### Authentication

- **Demo Login**: Use `Jeminee` / `Admin@123` to test the app
- **API Endpoint**: `http://192.168.1.79:5000/api/login`
- **Registration**: Create a new account with your details (if register endpoint exists)
- **Login**: Sign in with your registered credentials

### API Integration

The app is now connected to your real authentication API:

```bash
# Login Request
curl --location 'http://192.168.1.79:5000/api/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Jeminee",
    "password": "Admin@123"
}'
```

The app automatically:
- Sends requests to your API endpoint
- Handles JWT token storage
- Falls back to mock authentication if the API is unavailable
- Manages user sessions and logout

### Quiz Generation

1. Select a programming topic (HTML, Python, .NET, C#, SQL)
2. Choose difficulty level (Easy, Medium, Hard)
3. Select number of questions
4. Choose question types
5. Click "Generate Quiz" to create a new quiz

### Taking Quizzes

- Answer questions based on your knowledge
- For code questions, type your code in the provided editor
- Submit answers to see immediate feedback
- Review results and explanations

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthWrapper.tsx # Authentication wrapper
│   ├── Login.tsx       # Login form
│   ├── Register.tsx    # Registration form
│   ├── QuizGenerator.tsx
│   ├── QuizTaker.tsx
│   └── QuizResults.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── services/           # API services
│   ├── authService.ts  # Authentication service
│   └── geminiService.ts
├── types/              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   └── quiz.ts         # Quiz-related types
└── App.tsx            # Main application component
```

## API Endpoints

When using the mock server, the following endpoints are available:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user (requires authentication)
- `GET /health` - Health check

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_API_BASE_URL=http://localhost:3001
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Deploying
```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.

---

Built with ❤️ by Gourav
