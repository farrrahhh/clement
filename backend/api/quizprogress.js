import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from "mysql2";
import db from "../server.js";
import queryDb from "../server.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { username, quiz_id } = req.query;
    const getUserQuery = 'SELECT user_id FROM users WHERE username = ?';
    
    db.query(getUserQuery, [username], (err, userResults) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).send({ message: 'Error fetching user ID' });
        }
        if (userResults.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user_id = userResults[0].user_id;
        const getProgressQuery = 'SELECT quiz_id, total_score FROM user_progress WHERE user_id = ? AND quiz_id = ?';
        
        db.query(getProgressQuery, [user_id, quiz_id], (err, progressResults) => {
            if (err) {
                console.error('Error fetching quiz progress:', err);
                return res.status(500).send({ message: 'Error fetching quiz progress' });
            }
            if (progressResults.length === 0) {
                return res.send({ status: 'not_started' });
            }
            res.send(progressResults[0]);
        });
    });
});

export default router;