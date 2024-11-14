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
        // Check if the username already exists
        const [existingUser] = await queryDb('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // Hash the password and insert the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        await queryDb('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ message: 'Error signing up' });
    }
});

export default router;