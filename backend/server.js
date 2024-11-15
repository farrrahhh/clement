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

// Initialize Express application
const app = express();

// Middleware to enable CORS and parse JSON requests
app.use(cors());
app.use(bodyParser.json());

// Root route for a simple message
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Ruang Bahasa application." });
});

// Function to handle database queries
const queryDb = async (query, params) => {
  let connection;
  try {
    // Establish a new database connection
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
    });

    // Execute the query with parameters
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error in queryDb:", error);
    throw error;
  } finally {
    // Ensure the connection is closed after the query
    if (connection) await connection.end();
  }
};

// Export the query function for use in route files
export { queryDb };

// API routes
app.use("/signup", signup); // Route for user signup
app.use("/login", login); // Route for user login
app.use("/save-progress", saveprogress); // Route for saving progress
app.use("/change-password", changepass); // Route for changing password
app.use("/quiz-progress", quizprogress); // Route for quiz progress
app.use("/reset-quiz", resetquiz); // Route for resetting quiz

// Export the app for deployment (e.g., Vercel)
export default app;
