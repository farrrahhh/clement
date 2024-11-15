// backend/api/resetquiz.js
import express from "express";
import { queryDb } from "../server.js"; // Import queryDb from server.js

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, quiz_id } = req.query;

  // Validate input parameters
  if (!username || !quiz_id) {
    return res.status(400).send({ message: "Username and quiz_id are required." });
  }

  const getUserQuery = "SELECT user_id FROM users WHERE username = ?";

  try {
    // Check if the user exists
    const userResults = await queryDb(getUserQuery, [username]);

    if (userResults.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user_id = userResults[0].user_id;

    // Query to reset quiz progress for the user
    const resetProgressQuery = "DELETE FROM user_progress WHERE user_id = ? AND quiz_id = ?";

    // Delete quiz progress for the user
    const result = await queryDb(resetProgressQuery, [user_id, quiz_id]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "No progress found for the given quiz." });
    }

    res.send({ message: "Quiz reset successfully" });
  } catch (err) {
    console.error("Error resetting quiz:", err);
    res.status(500).send({ message: "Error resetting quiz" });
  }
});

export default router;
