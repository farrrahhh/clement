// backend/api/auth/changepassword.js
import express from "express";
import bcrypt from "bcryptjs";
import { queryDb } from "../server.js"; // Import queryDb from server.js

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // Check if the user exists and retrieve the current password
    const results = await queryDb("SELECT password FROM users WHERE username = ?", [username]);

    if (results.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Current password is incorrect" });
    }

    // Hash the new password and update it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await queryDb("UPDATE users SET password = ? WHERE username = ?", [hashedNewPassword, username]);

    res.send({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).send({ message: "Error updating password" });
  }
});

export default router;
