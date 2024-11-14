// Import required modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Import rute API
import login from "./api/login.js";
import changepass from "./api/changepassword.js";
import quizprogress from "./api/quizprogress.js";
import resetquiz from "./api/resetquiz.js";
import saveprogress from "./api/saveprogress.js";
import signup from "./api/signup.js";

// Check database connection

dotenv.config();

// const db = await mysql.createConnection({
//   host: process.env.MYSQLHOST,
//   database: process.env.MYSQLDATABASE,
//   port: process.env.MYSQLPORT,
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQLPASSWORD
// });

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// export default db;

const app = express();

// try {

//   // Test connection with a simple query
//   const [rows] = await db.query('SELECT 1');
//   console.log('Connection successful');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

const corsOptions = {
  origin: ["http://127.0.0.1:5500", "http://localhost:3000", "https://ruangbahasa-be.vercel.app"], // Allow requests from these origins
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ruang Bahasa application." });
});

// Check database connection
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

// Utility function for querying the database with promises
const queryDb = async (query, params) => {
  try {
    // Ensure params is an array
    if (!Array.isArray(params)) {
      params = [params];
    }
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export default queryDb;

// Rute API
app.use("/signup", signup);
app.use("/login", login);
app.use("/save-progress", saveprogress); // Rute untuk verifikasi token
app.use("/change-password", changepass); // Rute untuk signup
app.use("/quiz-progress", quizprogress); // Rute untuk login
app.use("/reset-quiz", resetquiz);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
