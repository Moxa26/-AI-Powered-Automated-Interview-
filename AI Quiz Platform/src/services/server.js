// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 5000;

// PostgreSQL connection pool
// Use explicit credentials to avoid SASL error
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "quizGenerateDB",
  password: process.env.DB_PASSWORD || "123456",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

app.use(cors());
app.use(express.json()); // no need for body-parser in modern Express

// ✅ Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("🔐 Login attempt:");
  console.log("Username:", username);
  console.log("Password:", password);

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password_hash = $2",
      [username, password]
    );

    console.log("📦 Query result:", result.rows);

    if (result.rows.length > 0) {
      console.log("✅ Login successful for user:", username);
      res.json({ success: true, message: "Login successful" });
    } else {
      console.log("❌ Invalid credentials for user:", username);
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("🚨 Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Save quiz
app.post("/api/quizzes", async (req, res) => {
  const client = await pool.connect();
  try {
    const { topic, difficulty, questionType, questions } = req.body;

    await client.query("BEGIN");

    const quizResult = await client.query(
      `INSERT INTO quizzes (topic, difficulty, question_type) 
       VALUES ($1, $2, $3) RETURNING id`,
      [topic, difficulty, questionType]
    );

    const quizId = quizResult.rows[0].id;

    for (const q of questions) {
      await client.query(
        `INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation)
         VALUES ($1, $2, $3, $4, $5)`,
        [quizId, q.question, q.options, q.correctAnswer, q.explanation]
      );
    }

    await client.query("COMMIT");

    res.json({ quizId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving quiz:", err);
    res.status(500).json({ error: "Failed to save quiz" });
  } finally {
    client.release();
  }
});

// ✅ Get quiz by ID
app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const quizId = req.params.id;

    const quizResult = await pool.query("SELECT * FROM quizzes WHERE id = $1", [
      quizId,
    ]);

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const questionsResult = await pool.query(
      "SELECT * FROM quiz_questions WHERE quiz_id = $1",
      [quizId]
    );

    res.json({
      ...quizResult.rows[0],
      questions: questionsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// ✅ Save quiz score
app.post("/api/save-quiz-score", async (req, res) => {
  const {
    userId,
    quizId,
    scorePercent,
    correctAnswers,
    totalQuestions,
    timeTaken,
    feedback,
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO quiz_results (
        user_id, quiz_id, score_percent, correct_answers,
        total_questions, time_taken, feedback
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      userId,
      quizId,
      scorePercent,
      correctAnswers,
      totalQuestions,
      timeTaken,
      feedback,
    ];

    const result = await pool.query(insertQuery, values);

    console.log("✅ Quiz result saved:", result.rows[0]);

    res.json({
      success: true,
      message: "Quiz result saved",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("🚨 Error saving quiz result:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save quiz result",
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
