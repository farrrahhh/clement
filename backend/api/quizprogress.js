// backend/api/auth/quizprogress.js
import express from "express";
import bcrypt from "bcryptjs";
import { queryDb } from "../server.js"; // Import queryDb from server.js

const router = express.Router();

// Endpoint to get quiz progress
router.get("/", async (req, res) => {
  const { username, quiz_id } = req.query;
  const getUserQuery = "SELECT user_id FROM users WHERE username = ?";

  try {
    const userResults = await queryDb(getUserQuery, [username]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_id = userResults[0].user_id;
    const getProgressQuery = "SELECT quiz_id, total_score FROM user_progress WHERE user_id = ? AND quiz_id = ?";

    const progressResults = await queryDb(getProgressQuery, [user_id, quiz_id]);

    if (progressResults.length === 0) {
      return res.json({ status: "not_started" });
    }

    res.json(progressResults[0]);
  } catch (err) {
    console.error("Error fetching quiz progress:", err);
    res.status(500).json({ message: "Error fetching quiz progress" });
  }
});

// Endpoint to change user password
router.post("/", async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const results = await queryDb("SELECT password FROM users WHERE username = ?", [username]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await queryDb("UPDATE users SET password = ? WHERE username = ?", [hashedNewPassword, username]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Error updating password" });
  }
});

export default router;
