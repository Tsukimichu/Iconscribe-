const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ===================================================
// Get all sales
// ===================================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM sales");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// Add sale
// ===================================================
router.post("/", async (req, res) => {
  let { order_item_id, item, amount, date } = req.body;

  if (!item || amount == null) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  if (!date) date = new Date().toISOString().split("T")[0];

  try {
    if (order_item_id) {
      const [existing] = await db
        .promise()
        .query("SELECT id FROM sales WHERE order_item_id = ?", [order_item_id]);

      if (existing.length > 0) {
        return res.json({
          success: false,
          message: "Sale already exists for this order item.",
        });
      }
    }

    await db
      .promise()
      .query("INSERT INTO sales (order_item_id, item, amount, date) VALUES (?, ?, ?, ?)", [
        order_item_id || null,
        item,
        amount,
        date,
      ]);

    res.json({ success: true, message: "Sale added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// Update sale
// ===================================================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { item, amount, date } = req.body;

  if (!item || !amount) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // Set system date if not provided
  const updateDate = date || new Date().toISOString().split("T")[0];

  try {
    await db
      .promise()
      .query("UPDATE sales SET item=?, amount=?, date=? WHERE id=?", [
        item,
        amount,
        updateDate,
        id,
      ]);
    res.json({ success: true, message: "Sale updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// Delete sale
// ===================================================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query("DELETE FROM sales WHERE id=?", [id]);
    res.json({ success: true, message: "Sale deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
