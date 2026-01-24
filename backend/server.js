// Server entry point
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// API routes
app.use("/items", require("./routes/items"));
app.use("/users", require("./routes/users"));
app.use("/employees", require("./routes/employees"));

// Use PORT from environment (Render provides this)
const PORT = process.env.PORT || 5000;

const pool = require("./db");

// Database migration check
const ensurePinColumn = async () => {
  try {
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='pin';
    `);

    if (result.rowCount === 0) {
      console.log("Adding 'pin' column to users table...");
      await pool.query("ALTER TABLE users ADD COLUMN pin VARCHAR(10);");
      console.log("'pin' column added successfully.");
    }
  } catch (err) {
    console.error("Error checking/adding pin column:", err);
  }
};

// Create employees table if it doesn't exist
const ensureEmployeesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255),
        salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
        phone VARCHAR(20),
        email VARCHAR(255),
        hire_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Employees table ready.");
  } catch (err) {
    console.error("Error creating employees table:", err);
  }
};

app.listen(PORT, async () => {
  await ensurePinColumn();
  await ensureEmployeesTable();
  console.log(`Backend running on port ${PORT}`);
});
