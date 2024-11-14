import express from "express";
import { pool } from "../server.js"; // Import pool from server.js

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, quiz_id } = req.query;
  const getUserQuery = "SELECT user_id FROM users WHERE username = ?";

  try {
    const [userResults] = await pool.query(getUserQuery, [username]);

    if (userResults.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user_id = userResults[0].user_id;
    const resetProgressQuery = "DELETE FROM user_progress WHERE user_id = ? AND quiz_id = ?";

    await pool.query(resetProgressQuery, [user_id, quiz_id]);

    res.send({ message: "Quiz reset successfully" });
  } catch (err) {
    console.error("Error resetting quiz:", err);
    res.status(500).send({ message: "Error resetting quiz" });
  }
});

export default router;
