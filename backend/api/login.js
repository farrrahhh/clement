//backend/api/auth/login.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from "mysql2";
import db from "../server.js";
import queryDb from "../server.js";


const router = express.Router();

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const [users] = await queryDb('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            res.status(200).json({ message: 'Login successful', user_id: user.user_id });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

export default router;