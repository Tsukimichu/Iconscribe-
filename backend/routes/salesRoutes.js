const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ===================================================
// Get all sales
// ===================================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        s.id,
        s.order_item_id,
        p.product_name AS item,
        s.quantity,
        s.amount,
        s.date
      FROM sales s
      JOIN orderitems oi ON s.order_item_id = oi.order_item_id
      JOIN products p ON oi.product_id = p.product_id
      ORDER BY s.date DESC, s.id DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ SALES FETCH ERROR:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// Add sale (NO 'item' column anymore)
// ===================================================
router.post("/", async (req, res) => {
  const { order_item_id, quantity, amount, date } = req.body;

  if (!order_item_id || !quantity || !amount || !date) {
    return res.status(400).json({
      success: false,
      message: "Missing fields: order_item_id, quantity, amount, date",
    });
  }

  try {
    // Prevent duplicates
    const [existing] = await db
      .promise()
      .query("SELECT id FROM sales WHERE order_item_id = ?", [order_item_id]);

    if (existing.length > 0) {
      return res.json({
        success: false,
        message: "Sale already exists for this order item.",
      });
    }

    // Insert sale
    await db
      .promise()
      .query(
        "INSERT INTO sales (order_item_id, quantity, amount, date) VALUES (?, ?, ?, ?)",
        [order_item_id, quantity, amount, date]
      );

    res.json({ success: true, message: "Sale added successfully" });
  } catch (err) {
    console.error("❌ ADD SALE ERROR:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// Update sale (NO 'item' column anymore)
// ===================================================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity, amount, date } = req.body;

  try {
    await db
      .promise()
      .query(
        "UPDATE sales SET quantity=?, amount=?, date=? WHERE id=?",
        [quantity, amount, date, id]
      );

    res.json({ success: true, message: "Sale updated successfully" });
  } catch (err) {
    console.error("❌ UPDATE SALE ERROR:", err);
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
    console.error("❌ DELETE SALE ERROR:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// PRODUCT TOTALS (uses orderitems + products)
// ===================================================
// sales table does NOT contain product, so use joins
router.get("/product-totals", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        p.product_name AS product,
        SUM(s.amount) AS total_sales
      FROM sales s
      JOIN orderitems oi ON s.order_item_id = oi.order_item_id
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.product_id
      ORDER BY total_sales DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ PRODUCT TOTALS ERROR:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
