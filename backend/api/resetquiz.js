import express from "express";
import db from "../server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, quiz_id } = req.query;
  const getUserQuery = "SELECT user_id FROM users WHERE username = ?";

  db.query(getUserQuery, [username], (err, userResults) => {
    if (err) {
      console.error("Error fetching user ID:", err);
      return res.status(500).send({ message: "Error fetching user ID" });
    }
    if (userResults.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user_id = userResults[0].user_id;
    const resetProgressQuery = "DELETE FROM user_progress WHERE user_id = ? AND quiz_id = ?";

    db.query(resetProgressQuery, [user_id, quiz_id], (err, result) => {
      if (err) {
        console.error("Error resetting quiz:", err);
        return res.status(500).send({ message: "Error resetting quiz" });
      }
      res.send({ message: "Quiz reset successfully" });
    });
  });
});

export default router;
