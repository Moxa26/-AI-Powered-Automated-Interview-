# AI-Powered Quiz Generator

A modern React application that generates custom quizzes using Google's Gemini AI. Built with TypeScript, Material-UI, and deployed on GitHub Pages.

## 🚀 Live Demo

**[Try the Quiz Generator →](https://gourav8jain.github.io/react_gemini-quiz)**

## 📸 Screenshot

*[Add a screenshot of your app here - you can take one from the live demo or local development]*

## ✨ Features

- **AI-Powered Quiz Generation**: Create quizzes on any topic using Google's Gemini AI
- **Customizable Settings**: Choose difficulty level, number of questions, and question types
- **Interactive Quiz Taking**: Beautiful UI with progress tracking and timer
- **Detailed Results**: Get comprehensive feedback with explanations for each answer
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern Tech Stack**: Built with React 19, TypeScript, and Material-UI

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **AI Integration**: Google Gemini AI API
- **Icons**: Lucide React
- **Deployment**: GitHub Pages
- **Build Tool**: Create React App

## 🎯 How It Works

1. **Generate Quiz**: Enter any topic (JavaScript, World History, Biology, etc.)
2. **Customize**: Set difficulty (Easy/Medium/Hard), number of questions (3-15), and type (Multiple Choice/True-False)
3. **Take Quiz**: Answer questions with a beautiful, interactive interface
4. **Review Results**: See your score, time taken, and detailed explanations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gourav8jain/react_gemini-quiz.git
   cd react_gemini-quiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini AI API key to the `.env` file:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Deployment

This app is deployed on GitHub Pages. To deploy your own version:

1. **Fork the repository**
2. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/react_gemini-quiz"
   ```
3. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

## 🔧 Project Structure

```
src/
├── components/          # React components
│   ├── QuizGenerator.tsx
│   ├── QuizTaker.tsx
│   └── QuizResults.tsx
├── services/           # API services
│   └── geminiService.ts
├── types/              # TypeScript type definitions
│   └── quiz.ts
└── App.tsx            # Main application component
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Gourav Jain**
- GitHub: [@gourav8jain](https://github.com/gourav8jain)
- Project: [React Gemini Quiz Generator](https://github.com/gourav8jain/react_gemini-quiz)

---

⭐ **Star this repository if you found it helpful!**
