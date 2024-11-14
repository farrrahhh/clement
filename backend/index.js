// Import required modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from "mysql2";

// Check database connection

dotenv.config();
const db = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: "mysql",
  logging: false,
});
const app = express();

try {
    await db.authenticate();
    console.log("Database Connected...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

// Middleware setup
// Configure CORS
// app.use(cors({
//     origin: 'https://ruang-bahasa.vercel.app',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true // If you need cookies/sessions
// }));

const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'https://ruangbahasa-be.vercel.app'], // Allow requests from these origins
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 200
};

app.get("/", (req, res) => {
    res.json({message: "Test"});
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
// // app.options('*', cors());

// fetch('http://localhost:3000/example', {
//     mode: 'no-cors',
//     method: "post",
//     headers: {
//          "Content-Type": "application/json"
//     },
//     body: JSON.stringify(ob)
// })

// Database connection


// const corsOptions = {
//     origin: 'http://localhost:3000', // or '*'
//     optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Ruang Bahasa application." });
});

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err.stack);
//     } else {
//         console.log('Connected to MySQL');
//     }
// });

// Utility function for querying the database with promises
const queryDb = (query, params) => {
    return db.promise().query(query, params);
};

// Routes

// User signup route
app.post('/signup', async (req, res) => {
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

// User login route
app.post('/login', async (req, res) => {
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

// Save user quiz progress route
// POST endpoint for saving progress
app.post('/save-progress', async (req, res) => {
    const { user_id, quiz_id, progress, total_score } = req.body;

    // Check if the required data is provided
    if (!user_id || !quiz_id || !Array.isArray(progress) || total_score === undefined) {
        return res.status(400).json({ message: 'Invalid data provided' });
    }

    try {
        // Check if the user exists
        const [users] = await queryDb('SELECT * FROM users WHERE user_id = ?', [user_id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const insertProgressQuery = `
            INSERT INTO user_quiz_progress (user_id, quiz_id, question_number, user_answer, correct_answer, score, total_score)
            VALUES (?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE
                user_answer = VALUES(user_answer),
                correct_answer = VALUES(correct_answer),
                score = VALUES(score),
                total_score = VALUES(total_score)
        `;

        const insertQuizProgress = `
            INSERT INTO user_progress (user_id, quiz_id, total_score)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                total_score = VALUES(total_score)
        `;

        // Loop through each question and save progress
        for (const question of progress) {
            const { question_number, user_answer, correct_answer, score } = question;

            if (question_number && (user_answer !== undefined || user_answer === null)) {
                console.log(`Saving progress for question ${question_number}:`, { user_answer, correct_answer, score, total_score });

                // Execute SQL to save the progress
                await queryDb(insertProgressQuery, [
                    user_id,
                    quiz_id,
                    question_number,
                    user_answer,
                    correct_answer,
                    score,
                    total_score
                ]);

            } else {
                console.warn(`Skipped invalid progress data for question: ${JSON.stringify(question)}`);
            }
        }

        await queryDb(insertQuizProgress, [user_id, quiz_id, total_score]);

        // Respond with a success message
        res.status(201).json({ message: 'Progress saved successfully' });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ message: 'Error saving progress' });
    }
});

// Change password route
app.post('/change-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    const query = 'SELECT password FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Error fetching user data' });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ message: 'Current password is incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = 'UPDATE users SET password = ? WHERE username = ?';
        db.query(updateQuery, [hashedNewPassword, username], (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Error updating password' });
            }
            res.send({ message: 'Password changed successfully' });
        });
    });
});

// Fetch quiz progress
app.get('/quiz-progress', (req, res) => {
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

// Reset quiz
app.post('/reset-quiz', (req, res) => {
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
        const resetProgressQuery = 'DELETE FROM user_progress WHERE user_id = ? AND quiz_id = ?';
        
        db.query(resetProgressQuery, [user_id, quiz_id], (err, result) => {
            if (err) {
                console.error('Error resetting quiz:', err);
                return res.status(500).send({ message: 'Error resetting quiz' });
            }
            res.send({ message: 'Quiz reset successfully' });
        });
    });
});


// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


