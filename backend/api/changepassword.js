import express from "express";
import bcrypt from "bcrypt";
import db from "../server.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  const query = "SELECT password FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).send({ message: "Error fetching user data" });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = "UPDATE users SET password = ? WHERE username = ?";
    db.query(updateQuery, [hashedNewPassword, username], (err, result) => {
      if (err) {
        return res.status(500).send({ message: "Error updating password" });
      }
      res.send({ message: "Password changed successfully" });
    });
  });
});

export default router;
