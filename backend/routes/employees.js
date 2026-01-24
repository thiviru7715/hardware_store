// Employee management routes - Using PostgreSQL
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all employees
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM employees ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ message: "Error fetching employees" });
    }
});

// Add new employee
router.post("/", async (req, res) => {
    const { name, position, salary, phone, email } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO employees (name, position, salary, phone, email, hire_date, created_at) 
             VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, NOW()) 
             RETURNING *`,
            [name, position || null, salary || 0, phone || null, email || null]
        );

        res.json({
            message: "Employee added successfully",
            employee: result.rows[0]
        });
    } catch (err) {
        console.error("Error adding employee:", err);
        res.status(500).json({ message: "Error adding employee" });
    }
});

// Update employee
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, position, salary, phone, email } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    try {
        const result = await pool.query(
            `UPDATE employees 
             SET name = $1, position = $2, salary = $3, phone = $4, email = $5
             WHERE id = $6 
             RETURNING *`,
            [name, position || null, salary || 0, phone || null, email || null, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({
            message: "Employee updated successfully",
            employee: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ message: "Error updating employee" });
    }
});

// Delete employee
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM employees WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ message: "Error deleting employee" });
    }
});

module.exports = router;
