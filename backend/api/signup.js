import express from "express";
import bcrypt from "bcryptjs";
import queryDb from "../server.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  console.log("Received signup request:", { username, password }); // Debugging request data

  try {
    // Check if the username already exists
    console.log("Checking if username already exists in the database...");
    const [existingUser] = await queryDb("SELECT * FROM users WHERE username = ?", [username]);

    if (existingUser.length > 0) {
      console.log("Username already exists.");
      return res.status(409).json({ message: "Username already exists." });
    }

    // Hash the password and insert the new user
    console.log("Hashing the password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Inserting new user into the database...");
    await queryDb("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    console.log("Signup successful");
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Error signing up" });
  }
});

export default router;
