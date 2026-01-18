// Items routes - Using JSON file storage
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "..", "items.json");

// Initialize file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([], null, 2));
}

// Helper functions
const readItems = () => {
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data);
};

const writeItems = (items) => {
  fs.writeFileSync(dataFile, JSON.stringify(items, null, 2));
};

// Get all items
router.get("/", (req, res) => {
  const items = readItems();
  res.json(items);
});

// Add new item
router.post("/", (req, res) => {
  const { name, price, quantity } = req.body;
  const items = readItems();
  const newItem = {
    id: Date.now(),
    name,
    price: parseFloat(price),
    quantity: parseInt(quantity)
  };
  items.push(newItem);
  writeItems(items);
  res.json({ message: "Item added", id: newItem.id });
});

// Increase stock
router.put("/increase/:id", (req, res) => {
  const { amount } = req.body;
  const items = readItems();
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    item.quantity += amount;
    writeItems(items);
    res.json({ message: "Stock increased" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Decrease stock
router.put("/decrease/:id", (req, res) => {
  const { amount } = req.body;
  const items = readItems();
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  if (item.quantity < amount) {
    return res.status(400).json({ message: "Not enough stock" });
  }
  item.quantity -= amount;
  writeItems(items);
  res.json({ message: "Stock decreased" });
});

// Delete item
router.delete("/:id", (req, res) => {
  let items = readItems();
  const originalLength = items.length;
  items = items.filter(i => i.id !== parseInt(req.params.id));
  if (items.length === originalLength) {
    return res.status(404).json({ message: "Item not found" });
  }
  writeItems(items);
  res.json({ message: "Item deleted" });
});

module.exports = router;

