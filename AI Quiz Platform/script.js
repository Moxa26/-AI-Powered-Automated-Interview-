// Global variables
let currentQuiz = null;
let currentQuestionIndex = 0;
let currentInterview = null;
let currentInterviewIndex = 0;
let currentCodingProblem = null;

// DOM elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set up navigation
    setupNavigation();
    
    // Set up file upload handlers
    setupFileUploads();
    
    // Show default section
    showSection('quiz-generator');
}

// Navigation functionality
function setupNavigation() {
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            showSection(sectionId);
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// File upload setup
function setupFileUploads() {
    // Quiz file upload
    const uploadArea = document.getElementById('upload-area');
    const quizFileInput = document.getElementById('quiz-file');
    
    uploadArea.addEventListener('click', () => quizFileInput.click());
    quizFileInput.addEventListener('change', handleQuizFileUpload);
    
    // Resume file upload
    const resumeUploadArea = document.getElementById('resume-upload-area');
    const resumeFileInput = document.getElementById('resume-file');
    
    resumeUploadArea.addEventListener('click', () => resumeFileInput.click());
    resumeFileInput.addEventListener('change', handleResumeFileUpload);
    
    // Candidates file upload
    const candidatesUploadArea = document.getElementById('candidates-upload-area');
    const candidatesFileInput = document.getElementById('candidates-file');
    
    candidatesUploadArea.addEventListener('click', () => candidatesFileInput.click());
    candidatesFileInput.addEventListener('change', handleCandidatesFileUpload);
}

// Quiz Generator Functions
async function generateQuiz() {
    const topic = document.getElementById('topic').value;
    const difficulty = document.getElementById('difficulty').value;
    const questionCount = document.getElementById('questionCount').value;
    const questionType = document.getElementById('questionType').value;
    
    if (!topic.trim()) {
        showError('Please enter a topic for the quiz.');
        return;
    }
    
    showLoading('Generating quiz questions...');
    
    try {
        // Simulate AI quiz generation (replace with actual API call)
        const quiz = await generateQuizWithAI(topic, difficulty, questionCount, questionType);
        
        currentQuiz = quiz;
        displayQuiz(quiz);
        
        hideLoading();
        showSuccess('Quiz generated successfully!');
        
        // Show quiz output
        document.getElementById('quiz-output').classList.remove('hidden');
        
    } catch (error) {
        hideLoading();
        showError('Failed to generate quiz: ' + error.message);
    }
}

async function generateQuizWithAI(topic, difficulty, questionCount, questionType) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate sample quiz data
    const questions = [];
    const questionTypes = ['multiple-choice', 'true-false', 'short-answer'];
    
    for (let i = 1; i <= questionCount; i++) {
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        if (questionType === 'multiple-choice') {
            questions.push({
                id: i,
                type: 'multiple-choice',
                question: `Sample ${difficulty} question ${i} about ${topic}?`,
                options: [
                    `Option A for question ${i}`,
                    `Option B for question ${i}`,
                    `Option C for question ${i}`,
                    `Option D for question ${i}`
                ],
                correctAnswer: Math.floor(Math.random() * 4)
            });
        } else if (questionType === 'true-false') {
            questions.push({
                id: i,
                type: 'true-false',
                question: `True or False: Sample ${difficulty} statement ${i} about ${topic}.`,
                options: ['True', 'False'],
                correctAnswer: Math.floor(Math.random() * 2)
            });
        } else {
            questions.push({
                id: i,
                type: 'short-answer',
                question: `Explain briefly: Sample ${difficulty} question ${i} about ${topic}.`,
                correctAnswer: 'Sample answer'
            });
        }
    }
    
    return {
        title: `${topic} Quiz - ${difficulty} Level`,
        topic: topic,
        difficulty: difficulty,
        questionCount: questionCount,
        questions: questions
    };
}

function displayQuiz(quiz) {
    const quizContent = document.getElementById('quiz-content');
    
    let html = `
        <div class="quiz-info">
            <h4>${quiz.title}</h4>
            <p><strong>Topic:</strong> ${quiz.topic}</p>
            <p><strong>Difficulty:</strong> ${quiz.difficulty}</p>
            <p><strong>Questions:</strong> ${quiz.questionCount}</p>
        </div>
        <div class="quiz-questions">
    `;
    
    quiz.questions.forEach((question, index) => {
        html += `
            <div class="question">
                <h4>Question ${index + 1}</h4>
                <p>${question.question}</p>
        `;
        
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
            html += '<div class="options">';
            question.options.forEach((option, optIndex) => {
                html += `
                    <div class="option">
                        <input type="radio" name="q${question.id}" value="${optIndex}" id="q${question.id}opt${optIndex}">
                        <label for="q${question.id}opt${optIndex}">${option}</label>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<textarea placeholder="Your answer here..." rows="3"></textarea>';
        }
        
        html += '</div>';
    });
    
    html += '</div>';
    quizContent.innerHTML = html;
}

function exportQuiz() {
    if (!currentQuiz) {
        showError('No quiz to export.');
        return;
    }
    
    const quizData = JSON.stringify(currentQuiz, null, 2);
    const blob = new Blob([quizData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentQuiz.topic.toLowerCase().replace(/\s+/g, '-')}-quiz.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess('Quiz exported successfully!');
}

// Quiz Taker Functions
function handleQuizFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const quizData = JSON.parse(e.target.result);
            currentQuiz = quizData;
            showSuccess('Quiz loaded successfully!');
        } catch (error) {
            showError('Invalid quiz file format.');
        }
    };
    reader.readAsText(file);
}

function startQuiz() {
    if (!currentQuiz && !document.getElementById('quiz-content-input').value.trim()) {
        showError('Please upload a quiz file or paste quiz content.');
        return;
    }
    
    if (!currentQuiz) {
        // Parse quiz content from textarea
        try {
            const quizText = document.getElementById('quiz-content-input').value;
            currentQuiz = JSON.parse(quizText);
        } catch (error) {
            showError('Invalid quiz content format.');
            return;
        }
    }
    
    currentQuestionIndex = 0;
    displayCurrentQuestion();
    
    document.getElementById('quiz-interface').classList.remove('hidden');
    document.querySelector('.quiz-upload').classList.add('hidden');
}

function displayCurrentQuestion() {
    if (!currentQuiz || currentQuestionIndex >= currentQuiz.questions.length) return;
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    totalQuestionsSpan.textContent = currentQuiz.questions.length;
    
    let html = `
        <div class="question">
            <h4>Question ${currentQuestionIndex + 1}</h4>
            <p>${question.question}</p>
    `;
    
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
        html += '<div class="options">';
        question.options.forEach((option, optIndex) => {
            html += `
                <div class="option" onclick="selectOption(${currentQuestionIndex}, ${optIndex})">
                    <input type="radio" name="q${question.id}" value="${optIndex}" id="q${question.id}opt${optIndex}">
                    <label for="q${question.id}opt${optIndex}">${option}</label>
                </div>
            `;
        });
        html += '</div>';
    } else {
        html += '<textarea id="short-answer" placeholder="Your answer here..." rows="3"></textarea>';
    }
    
    html += '</div>';
    questionContainer.innerHTML = html;
    
    updateNavigationButtons();
}

function selectOption(questionIndex, optionIndex) {
    const question = currentQuiz.questions[questionIndex];
    const options = document.querySelectorAll(`input[name="q${question.id}"]`);
    
    options.forEach((opt, index) => {
        if (index === optionIndex) {
            opt.checked = true;
        }
    });
    
    // Update visual selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-flex';
    nextBtn.style.display = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'none' : 'inline-flex';
    submitBtn.style.display = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'inline-flex' : 'none';
}

function submitQuiz() {
    // Calculate score
    let correctAnswers = 0;
    let totalQuestions = currentQuiz.questions.length;
    
    currentQuiz.questions.forEach((question, index) => {
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
            const selectedOption = document.querySelector(`input[name="q${question.id}"]:checked`);
            if (selectedOption && parseInt(selectedOption.value) === question.correctAnswer) {
                correctAnswers++;
            }
        }
        // For short answer questions, we'll skip scoring for now
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    showSuccess(`Quiz completed! Your score: ${score}% (${correctAnswers}/${totalQuestions} correct)`);
    
    // Reset quiz interface
    setTimeout(() => {
        document.getElementById('quiz-interface').classList.add('hidden');
        document.querySelector('.quiz-upload').classList.remove('hidden');
        currentQuiz = null;
        currentQuestionIndex = 0;
    }, 2000);
}

// Resume Screening Functions
function handleResumeFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Store the file for analysis
    window.resumeFile = file;
    showSuccess('Resume uploaded successfully!');
}

async function analyzeResume() {
    const jobDescription = document.getElementById('job-description').value;
    const resumeFile = window.resumeFile;
    
    if (!jobDescription.trim()) {
        showError('Please enter a job description.');
        return;
    }
    
    if (!resumeFile) {
        showError('Please upload a resume file.');
        return;
    }
    
    showLoading('Analyzing resume with AI...');
    
    try {
        // Simulate AI analysis (replace with actual API call)
        const analysis = await analyzeResumeWithAI(resumeFile, jobDescription);
        
        displayResumeAnalysis(analysis);
        
        hideLoading();
        showSuccess('Resume analysis completed!');
        
        document.getElementById('resume-results').classList.remove('hidden');
        
    } catch (error) {
        hideLoading();
        showError('Failed to analyze resume: ' + error.message);
    }
}

async function analyzeResumeWithAI(resumeFile, jobDescription) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Extract text from file (simplified)
    let resumeText = '';
    if (resumeFile.type === 'text/plain') {
        resumeText = await resumeFile.text();
    } else {
        resumeText = 'Sample resume text extracted from uploaded file...';
    }
    
    // Simulate AI analysis results
    return {
        rawText: resumeText,
        extractedSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
        matchedSkills: ['JavaScript', 'React'],
        experienceYears: 3,
        education: 'Bachelor\'s in Computer Science',
        score: 85,
        analysis: 'Strong technical background with relevant experience in web development technologies. Good match for the position requirements.'
    };
}

function displayResumeAnalysis(analysis) {
    const resumeContent = document.getElementById('resume-content');
    
    const html = `
        <div class="analysis-summary">
            <h4>Analysis Summary</h4>
            <div class="score-display">
                <span class="score">${analysis.score}%</span>
                <span class="score-label">Match Score</span>
            </div>
        </div>
        
        <div class="analysis-details">
            <div class="detail-item">
                <strong>Extracted Skills:</strong>
                <p>${analysis.extractedSkills.join(', ')}</p>
            </div>
            
            <div class="detail-item">
                <strong>Matched Skills:</strong>
                <p>${analysis.matchedSkills.join(', ')}</p>
            </div>
            
            <div class="detail-item">
                <strong>Experience:</strong>
                <p>${analysis.experienceYears} years</p>
            </div>
            
            <div class="detail-item">
                <strong>Education:</strong>
                <p>${analysis.education}</p>
            </div>
            
            <div class="detail-item">
                <strong>AI Analysis:</strong>
                <p>${analysis.analysis}</p>
            </div>
        </div>
    `;
    
    resumeContent.innerHTML = html;
}

// Interview Wizard Functions
async function generateInterview() {
    const role = document.getElementById('candidate-role').value;
    const experienceLevel = document.getElementById('experience-level').value;
    const focus = document.getElementById('interview-focus').value;
    
    if (!role.trim()) {
        showError('Please enter a candidate role.');
        return;
    }
    
    showLoading('Generating interview questions...');
    
    try {
        // Simulate AI interview generation
        const interview = await generateInterviewWithAI(role, experienceLevel, focus);
        
        currentInterview = interview;
        currentInterviewIndex = 0;
        
        displayInterviewQuestion();
        
        hideLoading();
        showSuccess('Interview generated successfully!');
        
        document.getElementById('interview-interface').classList.remove('hidden');
        document.querySelector('.interview-form').classList.add('hidden');
        
    } catch (error) {
        hideLoading();
        showError('Failed to generate interview: ' + error.message);
    }
}

async function generateInterviewWithAI(role, experienceLevel, focus) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate sample interview questions
    const questions = [
        `Tell me about your experience with ${role} and how you approach problem-solving.`,
        `Describe a challenging project you worked on and how you overcame obstacles.`,
        `How do you stay updated with the latest technologies in ${role}?`,
        `Give me an example of how you've mentored or helped team members grow.`,
        `What are your career goals and how does this position align with them?`
    ];
    
    return {
        role: role,
        experienceLevel: experienceLevel,
        focus: focus,
        questions: questions
    };
}

function displayInterviewQuestion() {
    if (!currentInterview || currentInterviewIndex >= currentInterview.questions.length) return;
    
    const question = currentInterview.questions[currentInterviewIndex];
    const questionElement = document.getElementById('interview-question');
    const questionNumSpan = document.getElementById('interview-question-num');
    const totalSpan = document.getElementById('interview-total');
    
    questionNumSpan.textContent = currentInterviewIndex + 1;
    totalSpan.textContent = currentInterview.questions.length;
    
    questionElement.textContent = question;
}

function submitAnswer() {
    const answer = document.getElementById('candidate-answer').value;
    
    if (!answer.trim()) {
        showError('Please provide an answer.');
        return;
    }
    
    // Simulate AI feedback
    const feedback = generateAIFeedback(answer);
    displayAIFeedback(feedback);
    
    // Clear answer
    document.getElementById('candidate-answer').value = '';
}

function generateAIFeedback(answer) {
    // Simulate AI analysis
    const feedbacks = [
        'Excellent answer! You demonstrated strong problem-solving skills and clear communication.',
        'Good response. Consider providing more specific examples to strengthen your answer.',
        'Well thought out answer. You showed good understanding of the topic.',
        'Good start, but try to elaborate more on your experience and achievements.'
    ];
    
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function displayAIFeedback(feedback) {
    const feedbackElement = document.getElementById('ai-feedback');
    feedbackElement.innerHTML = `<p><strong>AI Feedback:</strong> ${feedback}</p>`;
    feedbackElement.classList.remove('hidden');
}

function nextInterviewQuestion() {
    if (currentInterviewIndex < currentInterview.questions.length - 1) {
        currentInterviewIndex++;
        displayInterviewQuestion();
        document.getElementById('ai-feedback').classList.add('hidden');
    }
    
    // Show finish button on last question
    if (currentInterviewIndex === currentInterview.questions.length - 1) {
        document.querySelector('.interview-navigation .btn-success').style.display = 'inline-flex';
    }
}

function finishInterview() {
    showSuccess('Interview completed! Thank you for your responses.');
    
    setTimeout(() => {
        document.getElementById('interview-interface').classList.add('hidden');
        document.querySelector('.interview-form').classList.remove('hidden');
        currentInterview = null;
        currentInterviewIndex = 0;
        document.getElementById('ai-feedback').classList.add('hidden');
    }, 2000);
}

// Coding Assessment Functions
async function generateCodingProblem() {
    const difficulty = document.getElementById('problem-difficulty').value;
    const language = document.getElementById('programming-language').value;
    
    showLoading('Generating coding problem...');
    
    try {
        // Simulate AI problem generation
        const problem = await generateCodingProblemWithAI(difficulty, language);
        
        currentCodingProblem = problem;
        displayCodingProblem(problem);
        
        hideLoading();
        showSuccess('Coding problem generated!');
        
        document.getElementById('coding-interface').classList.remove('hidden');
        document.querySelector('.coding-form').classList.add('hidden');
        
    } catch (error) {
        hideLoading();
        showError('Failed to generate coding problem: ' + error.message);
    }
}

async function generateCodingProblemWithAI(difficulty, language) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const problems = {
        easy: {
            title: 'Array Sum',
            description: 'Write a function that takes an array of numbers and returns the sum of all elements.',
            examples: [
                'Input: [1, 2, 3, 4, 5]\nOutput: 15',
                'Input: [-1, 0, 1]\nOutput: 0'
            ],
            testCases: [
                { input: [1, 2, 3], expected: 6 },
                { input: [0, 0, 0], expected: 0 },
                { input: [-5, 5], expected: 0 }
            ]
        },
        medium: {
            title: 'Palindrome Check',
            description: 'Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
            examples: [
                'Input: "racecar"\nOutput: true',
                'Input: "hello"\nOutput: false'
            ],
            testCases: [
                { input: 'racecar', expected: true },
                { input: 'hello', expected: false },
                { input: 'A man a plan a canal Panama', expected: true }
            ]
        },
        hard: {
            title: 'Binary Tree Traversal',
            description: 'Implement an in-order traversal of a binary tree and return the values in an array.',
            examples: [
                'Input: Binary tree with values [1, 2, 3]\nOutput: [2, 1, 3]',
                'Input: Binary tree with values [4, 2, 6, 1, 3, 5, 7]\nOutput: [1, 2, 3, 4, 5, 6, 7]'
            ],
            testCases: [
                { input: '[1,2,3]', expected: [2, 1, 3] },
                { input: '[4,2,6,1,3,5,7]', expected: [1, 2, 3, 4, 5, 6, 7] }
            ]
        }
    };
    
    return {
        ...problems[difficulty],
        difficulty: difficulty,
        language: language
    };
}

function displayCodingProblem(problem) {
    const problemText = document.getElementById('problem-text');
    
    let html = `
        <h4>${problem.title}</h4>
        <p>${problem.description}</p>
        
        <h5>Examples:</h5>
        <pre><code>${problem.examples.join('\n\n')}</code></pre>
        
        <h5>Test Cases:</h5>
        <ul>
    `;
    
    problem.testCases.forEach((testCase, index) => {
        html += `<li><strong>Test ${index + 1}:</strong> Input: ${JSON.stringify(testCase.input)}, Expected: ${JSON.stringify(testCase.expected)}</li>`;
    });
    
    html += '</ul>';
    problemText.innerHTML = html;
}

function runCode() {
    const code = document.getElementById('code-input').value;
    
    if (!code.trim()) {
        showError('Please write some code first.');
        return;
    }
    
    showLoading('Running code...');
    
    setTimeout(() => {
        hideLoading();
        
        // Simulate code execution
        const output = simulateCodeExecution(code);
        displayCodeResults(output, null);
        
    }, 1500);
}

function simulateCodeExecution(code) {
    // Simple simulation - in real app, this would use Judge0 or similar service
    if (code.includes('function') && code.includes('return')) {
        return {
            success: true,
            output: 'Code executed successfully!\nOutput: Sample result',
            executionTime: '0.002s'
        };
    } else {
        return {
            success: false,
            output: 'Syntax error: Invalid function definition',
            executionTime: '0.001s'
        };
    }
}

function submitCode() {
    const code = document.getElementById('code-input').value;
    
    if (!code.trim()) {
        showError('Please write some code first.');
        return;
    }
    
    showLoading('Evaluating solution...');
    
    setTimeout(() => {
        hideLoading();
        
        // Simulate AI evaluation
        const evaluation = generateAIEvaluation(code);
        const executionOutput = simulateCodeExecution(code);
        
        displayCodeResults(executionOutput, evaluation);
        
    }, 2000);
}

function generateAIEvaluation(code) {
    // Simulate AI code review
    const evaluations = [
        'Excellent solution! Clean, efficient code with good variable naming.',
        'Good approach, but consider adding error handling for edge cases.',
        'Well-structured code. Consider optimizing the algorithm for better performance.',
        'Good logic, but the code could benefit from more descriptive variable names.'
    ];
    
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    
    return {
        feedback: evaluations[Math.floor(Math.random() * evaluations.length)],
        score: score,
        suggestions: ['Add input validation', 'Consider edge cases', 'Optimize for performance']
    };
}

function displayCodeResults(executionOutput, evaluation) {
    const resultsElement = document.getElementById('code-results');
    const executionOutputElement = document.getElementById('execution-output');
    const aiEvaluationElement = document.getElementById('ai-evaluation');
    
    let executionHtml = `
        <h4>Execution Results</h4>
        <div class="execution-status ${executionOutput.success ? 'success' : 'error'}">
            <strong>Status:</strong> ${executionOutput.success ? 'Success' : 'Error'}
        </div>
        <div class="execution-time">
            <strong>Execution Time:</strong> ${executionOutput.executionTime}
        </div>
        <div class="execution-output">
            <strong>Output:</strong>
            <pre><code>${executionOutput.output}</code></pre>
        </div>
    `;
    
    executionOutputElement.innerHTML = executionHtml;
    
    if (evaluation) {
        let evaluationHtml = `
            <h4>AI Code Review</h4>
            <div class="review-score">
                <strong>Score:</strong> ${evaluation.score}/100
            </div>
            <div class="review-feedback">
                <strong>Feedback:</strong> ${evaluation.feedback}
            </div>
            <div class="review-suggestions">
                <strong>Suggestions:</strong>
                <ul>
                    ${evaluation.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        `;
        
        aiEvaluationElement.innerHTML = evaluationHtml;
    }
    
    resultsElement.classList.remove('hidden');
}

// Candidate Ranking Functions
function handleCandidatesFileUpload(event) {
    const files = event.target.files;
    if (!files.length) return;
    
    // Store files for analysis
    window.candidateFiles = Array.from(files);
    showSuccess(`${files.length} candidate file(s) uploaded successfully!`);
}

async function rankCandidates() {
    const criteria = document.getElementById('ranking-criteria').value;
    const candidateFiles = window.candidateFiles;
    
    if (!candidateFiles || candidateFiles.length === 0) {
        showError('Please upload candidate files first.');
        return;
    }
    
    showLoading('Analyzing and ranking candidates...');
    
    try {
        // Simulate AI ranking
        const rankings = await rankCandidatesWithAI(candidateFiles, criteria);
        
        displayCandidateRankings(rankings);
        
        hideLoading();
        showSuccess('Candidate ranking completed!');
        
        document.getElementById('ranking-results').classList.remove('hidden');
        
    } catch (error) {
        hideLoading();
        showError('Failed to rank candidates: ' + error.message);
    }
}

async function rankCandidatesWithAI(candidateFiles, criteria) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Generate sample rankings
    const candidates = [];
    
    candidateFiles.forEach((file, index) => {
        const scores = {
            overall: Math.floor(Math.random() * 30) + 70,
            technical: Math.floor(Math.random() * 30) + 70,
            experience: Math.floor(Math.random() * 30) + 70,
            culture_fit: Math.floor(Math.random() * 30) + 70
        };
        
        candidates.push({
            id: index + 1,
            name: `Candidate ${index + 1}`,
            email: `candidate${index + 1}@example.com`,
            resume: file.name,
            scores: scores,
            summary: `Strong candidate with ${scores.overall}% overall match.`
        });
    });
    
    // Sort by selected criteria
    candidates.sort((a, b) => b.scores[criteria] - a.scores[criteria]);
    
    return {
        criteria: criteria,
        candidates: candidates
    };
}

function displayCandidateRankings(rankings) {
    const candidatesList = document.getElementById('candidates-list');
    
    let html = `
        <div class="ranking-header">
            <h4>Ranked by: ${rankings.criteria.charAt(0).toUpperCase() + rankings.criteria.slice(1)}</h4>
        </div>
    `;
    
    rankings.candidates.forEach((candidate, index) => {
        const rank = index + 1;
        const score = candidate.scores[rankings.criteria];
        
        html += `
            <div class="candidate-card">
                <div class="candidate-info">
                    <h4>#${rank} - ${candidate.name}</h4>
                    <p><strong>Email:</strong> ${candidate.email}</p>
                    <p><strong>Resume:</strong> ${candidate.resume}</p>
                    <p><strong>Summary:</strong> ${candidate.summary}</p>
                </div>
                <div class="candidate-score">
                    ${score}%
                </div>
            </div>
        `;
    });
    
    candidatesList.innerHTML = html;
}

// Utility Functions
function showLoading(message) {
    const modal = document.getElementById('loading-modal');
    const messageElement = modal.querySelector('p');
    messageElement.textContent = message;
    modal.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-modal').classList.add('hidden');
}

function showSuccess(message) {
    const modal = document.getElementById('success-modal');
    const messageElement = document.getElementById('success-message');
    messageElement.textContent = message;
    modal.classList.remove('hidden');
}

function showError(message) {
    const modal = document.getElementById('error-modal');
    const messageElement = document.getElementById('error-message');
    messageElement.textContent = message;
    modal.classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// Add some sample data for demonstration
window.addEventListener('load', function() {
    // Pre-fill some fields with sample data
    document.getElementById('topic').value = 'JavaScript Fundamentals';
    document.getElementById('job-description').value = 'We are looking for a skilled JavaScript developer with experience in React and Node.js. The ideal candidate should have at least 2 years of experience in web development and be passionate about creating high-quality, scalable applications.';
    document.getElementById('candidate-role').value = 'Frontend Developer';
});
