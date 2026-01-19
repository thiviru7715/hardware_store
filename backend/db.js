// PostgreSQL Database connection (Neon Serverless)
require("dotenv").config();
const { Pool } = require("pg");

// Use DATABASE_URL for Neon connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Neon PostgreSQL Database connected");
    release();
  }
});

module.exports = pool;
