import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "../server.js"; // Import pool from server.js
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    const [results] = await pool.query("SELECT password FROM users WHERE username = ?", [username]);

    if (results.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE username = ?", [hashedNewPassword, username]);

    res.send({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).send({ message: "Error updating password" });
  }
});

export default router;
