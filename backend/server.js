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

// Use PORT from environment (Render provides this)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
