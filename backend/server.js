// Import required modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Configure environment variables
dotenv.config();

// Set up Sequelize with environment variables
const db = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: "mysql",
  logging: false,
});

// Test the database connection
(async () => {
  try {
    await db.authenticate();
    console.log("Database Connected...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const app = express();

// Configure CORS options
const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:3000", "https://ruangbahasa-be.vercel.app"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Utility function for querying the database
const queryDb = async (query, params) => {
  try {
    const [results, metadata] = await db.query(query, { replacements: params });
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// Routes
// Example route to test the connection
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ruang Bahasa application." });
});

// Other routes here (e.g., /login, /signup)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export { queryDb };
