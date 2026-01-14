// Items routes
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM items", (err, data) => {
    res.json(data);
  });
});

router.put("/increase/:id", (req, res) => {
  const { amount } = req.body;

  db.query(
    "UPDATE items SET quantity = quantity + ? WHERE id = ?",
    [amount, req.params.id],
    () => res.json({ message: "Stock increased" })
  );
});

router.put("/decrease/:id", (req, res) => {
  const { amount } = req.body;

  db.query(
    "SELECT quantity FROM items WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (result[0].quantity < amount) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      db.query(
        "UPDATE items SET quantity = quantity - ? WHERE id = ?",
        [amount, req.params.id],
        () => res.json({ message: "Stock decreased" })
      );
    }
  );
});

module.exports = router;
