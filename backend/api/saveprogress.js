// backend/api/saveprogress.js
import express from "express";
import { queryDb } from "../server.js"; // Import queryDb from server.js

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, quiz_id, progress, total_score } = req.body;

  // Validate input data
  if (!user_id || !quiz_id || !Array.isArray(progress) || total_score === undefined) {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  try {
    // Check if user exists
    const users = await queryDb("SELECT * FROM users WHERE user_id = ?", [user_id]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Query to save individual question progress
    const insertProgressQuery = `
      INSERT INTO user_quiz_progress (user_id, quiz_id, question_number, user_answer, correct_answer, score, total_score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        user_answer = VALUES(user_answer),
        correct_answer = VALUES(correct_answer),
        score = VALUES(score),
        total_score = VALUES(total_score)
    `;

    // Query to save quiz progress for the user
    const insertQuizProgressQuery = `
      INSERT INTO user_progress (user_id, quiz_id, total_score)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_score = VALUES(total_score)
    `;

    // Loop through progress array and save each question's data
    const progressPromises = progress.map(async (question) => {
      const { question_number, user_answer, correct_answer, score } = question;

      if (question_number && (user_answer !== undefined || user_answer === null)) {
        console.log(`Saving progress for question ${question_number}:`, { user_answer, correct_answer, score, total_score });

        await queryDb(insertProgressQuery, [user_id, quiz_id, question_number, user_answer, correct_answer, score, total_score]);
      } else {
        console.warn(`Skipped invalid progress data for question: ${JSON.stringify(question)}`);
      }
    });

    // Wait for all question progress to be saved
    await Promise.all(progressPromises);

    // Save overall quiz progress
    await queryDb(insertQuizProgressQuery, [user_id, quiz_id, total_score]);

    res.status(201).json({ message: "Progress saved successfully" });
  } catch (error) {
    console.error("Error saving progress:", error);
    res.status(500).json({ message: "Error saving progress" });
  }
});

export default router;
