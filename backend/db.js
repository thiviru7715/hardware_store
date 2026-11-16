// PostgreSQL Database connection (Neon Serverless)
require("dotenv").config();
const { Pool } = require("pg");

// Use DATABASE_URL for Neon connection string
// Neon (cloud) needs SSL; a local PostgreSQL on this computer usually doesn't support it
const isLocalDb = /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocalDb ? false : { rejectUnauthorized: false }
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log(isLocalDb ? "Local PostgreSQL Database connected" : "Neon PostgreSQL Database connected");
    release();
  }
});

module.exports = pool;
