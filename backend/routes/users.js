// User authentication routes - Using JSON file storage
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "..", "users.json");

// Initialize file if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

// Helper functions
const readUsers = () => {
    const data = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(data);
};

const writeUsers = (users) => {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
};

// Register new user
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const users = readUsers();

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In production, this should be hashed!
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ message: "Registration successful", user: userWithoutPassword });
});

// Login user
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Login successful", user: userWithoutPassword });
});

module.exports = router;
