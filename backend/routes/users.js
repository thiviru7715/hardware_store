// User authentication routes - Using PostgreSQL
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Register new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rowCount > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Insert new user
        const result = await pool.query(
            "INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at",
            [name, email, password] // In production, password should be hashed!
        );

        res.json({
            message: "Registration successful",
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const result = await pool.query(
            "SELECT id, name, email, created_at FROM users WHERE email = $1 AND password = $2",
            [email, password]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            message: "Login successful",
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: "Error logging in" });
    }
});

// Login user with PIN
router.post("/login-pin", async (req, res) => {
    const { pin } = req.body;

    if (!pin) {
        return res.status(400).json({ message: "PIN is required" });
    }

    try {
        const result = await pool.query(
            "SELECT id, name, email, created_at FROM users WHERE pin = $1",
            [pin]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: "Invalid PIN" });
        }

        res.json({
            message: "Login successful",
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Error logging in with PIN:", err);
        res.status(500).json({ message: "Error logging in with PIN" });
    }
});

// Update PIN
router.put("/pin", async (req, res) => {
    const { email, pin } = req.body;

    if (!email || !pin) {
        return res.status(400).json({ message: "Email and PIN are required" });
    }

    try {
        const result = await pool.query(
            "UPDATE users SET pin = $1 WHERE email = $2 RETURNING id",
            [pin, email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "PIN updated successfully" });
    } catch (err) {
        console.error("Error updating PIN:", err);
        res.status(500).json({ message: "Error updating PIN" });
    }
});

module.exports = router;
