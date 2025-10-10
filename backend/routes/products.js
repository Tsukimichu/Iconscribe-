const express = require("express");
const db = require("../models/db.js");
const router = express.Router();

// ====================================================
// GET all products
// ====================================================
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.json(rows);
  });
});

// ====================================================
// ADD new product
// ====================================================
router.post("/", (req, res) => {
  const { product_name, product_type, status } = req.body;
  db.query(
    "INSERT INTO products (product_name, product_type, status) VALUES (?, ?, ?)",
    [product_name, product_type || "General", status || "Active"],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add product" });
      res.json({
        success: true,
        product_id: result.insertId,
        product_name,
        product_type,
        status,
      });
    }
  );
});

// ====================================================
// UPDATE product status (Active / Inactive)
// ====================================================
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE products SET status = ? WHERE product_id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Failed to update status" });
      res.json({ success: true, message: "Product status updated" });
    }
  );
});

// ====================================================
// DELETE product
// ====================================================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE product_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete product" });
    res.json({ success: true, message: "Product deleted successfully" });
  });
});

module.exports = router;
