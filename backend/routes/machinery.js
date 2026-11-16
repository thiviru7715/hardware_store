// Machinery (Tool Shop) routes - Using PostgreSQL
const express = require("express");
const router = express.Router();
const pool = require("../db");

const FIELDS = [
  "name", "brand", "model", "category", "power", "condition",
  "price", "quantity", "warranty_months", "image_url", "description",
];

// Build a clean value for each field (null when not provided)
const clean = (field, value) => {
  if (value === undefined || value === null || value === "") return null;
  if (field === "price") return parseFloat(value);
  if (field === "quantity" || field === "warranty_months") return parseInt(value);
  return String(value).trim();
};

// Records a price change in machinery_price_history
const logPrice = (client, id, oldPrice, newPrice, source) =>
  client.query(
    `INSERT INTO machinery_price_history (machinery_id, old_price, new_price, source)
     VALUES ($1, $2, $3, $4)`,
    [id, oldPrice, newPrice, source]
  );

// Get all machinery (optional ?category=&search=)
router.get("/", async (req, res) => {
  const { category, search } = req.query;
  const where = [];
  const params = [];
  if (category) {
    params.push(category);
    where.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    where.push(`(name ILIKE $${params.length} OR brand ILIKE $${params.length} OR model ILIKE $${params.length})`);
  }
  try {
    const result = await pool.query(
      `SELECT * FROM machinery ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY category, name`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching machinery:", err);
    res.status(500).json({ message: "Error fetching machinery" });
  }
});

// Distinct categories (for filters)
router.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT category, COUNT(*)::int AS count FROM machinery GROUP BY category ORDER BY category"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Price history for one machine
router.get("/:id/price-history", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM machinery_price_history WHERE machinery_id = $1 ORDER BY changed_at DESC LIMIT 50",
      [parseInt(req.params.id)]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching price history:", err);
    res.status(500).json({ message: "Error fetching price history" });
  }
});

// Add new machine
router.post("/", async (req, res) => {
  const body = req.body || {};
  if (!body.name || body.price === undefined || body.price === null) {
    return res.status(400).json({ message: "Name and price are required" });
  }
  const values = FIELDS.map((f) => clean(f, body[f]));
  // defaults
  values[FIELDS.indexOf("category")] = values[FIELDS.indexOf("category")] || "Other";
  values[FIELDS.indexOf("condition")] = values[FIELDS.indexOf("condition")] || "New";
  values[FIELDS.indexOf("quantity")] = values[FIELDS.indexOf("quantity")] ?? 0;

  try {
    const result = await pool.query(
      `INSERT INTO machinery (${FIELDS.join(", ")}, price_updated_at)
       VALUES (${FIELDS.map((_, i) => `$${i + 1}`).join(", ")}, NOW())
       RETURNING *`,
      values
    );
    res.json({ message: "Machine added", item: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "A machine with this model code already exists" });
    }
    console.error("Error adding machine:", err);
    res.status(500).json({ message: "Error adding machine" });
  }
});

// Bulk price update — used by the Tool Shop page and by scripts/update-machinery-prices.js
// Body: { updates: [{ id?, model?, price, quantity? }], source?: "antigravity" }
// Each row is matched by id, or by model code if no id is given.
router.put("/prices/bulk", async (req, res) => {
  const { updates, source } = req.body || {};
  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ message: "updates must be a non-empty array" });
  }
  if (updates.length > 1000) {
    return res.status(400).json({ message: "Max 1000 rows per request" });
  }

  const client = await pool.connect();
  const updated = [];
  const notFound = [];
  const invalid = [];
  try {
    await client.query("BEGIN");
    for (const row of updates) {
      const price = parseFloat(row.price);
      if (Number.isNaN(price) || price < 0) {
        invalid.push(row);
        continue;
      }
      const found = row.id
        ? await client.query("SELECT id, price FROM machinery WHERE id = $1", [parseInt(row.id)])
        : await client.query("SELECT id, price FROM machinery WHERE LOWER(model) = LOWER($1)", [String(row.model || "")]);

      if (found.rowCount === 0) {
        notFound.push(row.id || row.model);
        continue;
      }
      const { id, price: oldPrice } = found.rows[0];
      const qty = row.quantity !== undefined && row.quantity !== "" ? parseInt(row.quantity) : null;

      await client.query(
        `UPDATE machinery
         SET price = $1,
             quantity = COALESCE($2, quantity),
             price_updated_at = CASE WHEN price <> $1 THEN NOW() ELSE price_updated_at END
         WHERE id = $3`,
        [price, Number.isNaN(qty) ? null : qty, id]
      );
      if (Number(oldPrice) !== price) {
        await logPrice(client, id, oldPrice, price, source || "bulk");
      }
      updated.push(id);
    }
    await client.query("COMMIT");
    res.json({ message: "Prices updated", updated: updated.length, notFound, invalid: invalid.length });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error bulk updating prices:", err);
    res.status(500).json({ message: "Error updating prices" });
  } finally {
    client.release();
  }
});

// Increase stock
router.put("/increase/:id", async (req, res) => {
  const amount = parseInt(req.body.amount);
  if (!amount || amount < 1) return res.status(400).json({ message: "Invalid amount" });
  try {
    const result = await pool.query(
      "UPDATE machinery SET quantity = quantity + $1 WHERE id = $2 RETURNING *",
      [amount, parseInt(req.params.id)]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: "Machine not found" });
    res.json({ message: "Stock increased", item: result.rows[0] });
  } catch (err) {
    console.error("Error increasing machinery stock:", err);
    res.status(500).json({ message: "Error increasing stock" });
  }
});

// Decrease stock (never below zero)
router.put("/decrease/:id", async (req, res) => {
  const amount = parseInt(req.body.amount);
  if (!amount || amount < 1) return res.status(400).json({ message: "Invalid amount" });
  try {
    const result = await pool.query(
      "UPDATE machinery SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1 RETURNING *",
      [amount, parseInt(req.params.id)]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Not enough stock or machine not found" });
    }
    res.json({ message: "Stock decreased", item: result.rows[0] });
  } catch (err) {
    console.error("Error decreasing machinery stock:", err);
    res.status(500).json({ message: "Error decreasing stock" });
  }
});

// Update machine (any subset of fields)
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body || {};
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const current = await client.query("SELECT * FROM machinery WHERE id = $1", [id]);
    if (current.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Machine not found" });
    }

    const sets = [];
    const params = [];
    for (const f of FIELDS) {
      if (body[f] !== undefined) {
        params.push(clean(f, body[f]));
        sets.push(`${f} = $${params.length}`);
      }
    }
    if (sets.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Nothing to update" });
    }

    const oldPrice = Number(current.rows[0].price);
    const newPrice = body.price !== undefined ? parseFloat(body.price) : oldPrice;
    if (newPrice !== oldPrice) sets.push("price_updated_at = NOW()");

    params.push(id);
    const result = await client.query(
      `UPDATE machinery SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
      params
    );
    if (newPrice !== oldPrice) await logPrice(client, id, oldPrice, newPrice, "manual");
    await client.query("COMMIT");
    res.json({ message: "Machine updated", item: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      return res.status(409).json({ message: "A machine with this model code already exists" });
    }
    console.error("Error updating machine:", err);
    res.status(500).json({ message: "Error updating machine" });
  } finally {
    client.release();
  }
});

// Delete machine
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM machinery WHERE id = $1", [parseInt(req.params.id)]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Machine not found" });
    res.json({ message: "Machine deleted" });
  } catch (err) {
    console.error("Error deleting machine:", err);
    res.status(500).json({ message: "Error deleting machine" });
  }
});

module.exports = router;
