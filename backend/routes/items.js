// Items routes - Using PostgreSQL
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all items
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: "Error fetching items" });
  }
});

// Add new item
router.post("/", async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO items (name, price, quantity) VALUES ($1, $2, $3) RETURNING id",
      [name, parseFloat(price), parseInt(quantity)]
    );
    res.json({ message: "Item added", id: result.rows[0].id });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Error adding item" });
  }
});

// Increase stock at once
router.put("/increase/:id", async (req, res) => {
  const { amount } = req.body;
  try {
    const result = await pool.query(
      "UPDATE items SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
      [amount, parseInt(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Stock increased" });
  } catch (err) {
    console.error("Error increasing stock:", err);
    res.status(500).json({ message: "Error increasing stock" });
  }
});

// Decrease stock
router.put("/decrease/:id", async (req, res) => {
  const { amount } = req.body;
  try {
    // First check current quantity
    const checkResult = await pool.query(
      "SELECT quantity FROM items WHERE id = $1",
      [parseInt(req.params.id)]
    );

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (checkResult.rows[0].quantity < amount) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    await pool.query(
      "UPDATE items SET quantity = quantity - $1 WHERE id = $2",
      [amount, parseInt(req.params.id)]
    );
    res.json({ message: "Stock decreased" });
  } catch (err) {
    console.error("Error decreasing stock:", err);
    res.status(500).json({ message: "Error decreasing stock" });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1",
      [parseInt(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
});

// Update item (name, price, quantity)
router.put("/:id", async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const result = await pool.query(
      "UPDATE items SET name = COALESCE($1, name), price = COALESCE($2, price), quantity = COALESCE($3, quantity) WHERE id = $4 RETURNING *",
      [name, price !== undefined ? parseFloat(price) : null, quantity !== undefined ? parseInt(quantity) : null, parseInt(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item updated", item: result.rows[0] });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Error updating item" });
  }
});

module.exports = router;
