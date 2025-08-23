// Load environment variables from .env
require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const { use } = require("react");

const app = express();
const port = 4000;

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
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password_hash = $2",
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          is_admin: user.is_admin
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Save quizzesDetail
app.post("/api/quizzesDetail", async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, questions } = req.body;

    if (!userId || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "quizId and questions are required" });
    }

    await client.query("BEGIN");

    for (const q of questions) {
      if (!q.question || !q.options || q.correctAnswer === undefined) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Each question must have question, options, and correctAnswer" });
      }

      await client.query(
        `INSERT INTO quiz_questions (user_id, question, options, correct_answer, explanation)
         VALUES ($1, $2, $3, $4, $5)`,
        [userId, q.question, q.options, q.correctAnswer, q.explanation || null]
      );
    }

    await client.query("COMMIT");

    res.json({ success: true, userId, inserted: questions.length });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving quiz questions:", err.message);
    res.status(500).json({ error: "Failed to save quiz questions", details: err.message });
  } finally {
    client.release();
  }
});

// ✅ Get quizzesDetail by ID
app.get("/api/quizzesDetail/:id", async (req, res) => {
  try {
    const quizId = req.params.id;

    const quizResult = await pool.query("SELECT * FROM quiz_questions  WHERE id = $1", [
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

// ✅ Save quizzesDetail score
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


// ======================= USERS CRUD =======================

// Create User
app.post("/api/users-with-quiz", async (req, res) => {
  const { username, password, topic, difficulty, question_type } = req.body;

  if (!username || !password || !topic || !difficulty || !question_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (username, password_hash, topic, difficulty, question_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, topic, difficulty, question_type, created_at`,
      [username, password, topic, difficulty, question_type]
    );

    const user = userResult.rows[0];

    await client.query("COMMIT");

    res.json({ success: true, user });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating user with quiz:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.get("/api/quiz-by-users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id AS user_id,
        username,
        topic AS quiz_topic,
        difficulty AS quiz_difficulty,
        question_type AS quiz_question_type,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({ success: true, quizzes: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.get("/api/quiz-by-user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        id AS user_id,
        username,
        topic AS quiz_topic,
        difficulty AS quiz_difficulty,
        question_type AS quiz_question_type,
        created_at
      FROM users
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.put("/api/update-user-with-quiz/:userId", async (req, res) => {
  const { userId } = req.params;
  const { username, password, topic, difficulty, question_type } = req.body;

  if (!username || !password || !topic || !difficulty || !question_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update user with quiz fields directly
    const userResult = await client.query(
      `UPDATE users 
       SET username = $1, password_hash = $2, topic = $3, difficulty = $4, question_type = $5
       WHERE id = $6
       RETURNING id, username, topic, difficulty, question_type, created_at`,
      [username, password, topic, difficulty, question_type, userId]
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    await client.query("COMMIT");

    res.json({ success: true, user });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating user with quiz:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: "User deleted", user: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});



app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
