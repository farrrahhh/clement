// Import required modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Import API routes
import changepass from "./api/changepassword.js";
import quizprogress from "./api/quizprogress.js";
import resetquiz from "./api/resetquiz.js";
import saveprogress from "./api/saveprogress.js";
import signup from "./api/signup.js";
import login from "./api/login.js";

// Load environment variables
dotenv.config();

// server.js
export const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  connectTimeout: 20000,
});

// Initialize Express application
const app = express();

// Middleware setup
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:3000", "https://ruangbahasa-be.vercel.app"], // Allowed origins
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Simple root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ruang Bahasa application." });
});

// Check MySQL connection on server start
(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log("Database Connected...");
    connection.release();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Mengembalikan hasil query yang benar
const queryDb = async (query, params) => {
  try {
    const [rows] = await pool.query(query, params);
    return rows; // Mengembalikan data hasil query
  } catch (error) {
    console.error("Error in queryDb:", error);
    throw error;
  }
};

export { queryDb };

// API Routes
app.use("/signup", signup);
app.use("/login", login);
app.use("/save-progress", saveprogress); // Route for save-progress
app.use("/change-password", changepass); // Route for password change
app.use("/quiz-progress", quizprogress); // Route for quiz progress
app.use("/reset-quiz", resetquiz); // Route for resetting quiz

// Export the app for Vercel
export default app;
