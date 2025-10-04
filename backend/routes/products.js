const express = require("express");
const db = require("../models/db.js");
const router = express.Router();

// Get all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.json(rows);
  });
});

// Add new product
router.post("/", (req, res) => {
  const { product_name, product_type, status } = req.body;
  db.query(
    "INSERT INTO products (product_name, product_type, status) VALUES (?, ?, ?)",
    [product_name, product_type || null, status || "active"],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add product" });
      res.json({ product_id: result.insertId, product_name, product_type, status });
    }
  );
});

// Update product status
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query("UPDATE products SET status = ? WHERE product_id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update status" });
    res.json({ success: true });
  });
});

module.exports = router;
