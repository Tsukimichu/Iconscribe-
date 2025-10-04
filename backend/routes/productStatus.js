const express = require("express");
const db = require("../models/db.js");

const router = express.Router();

// GET all product statuses
router.get("/", (req, res) => {
  db.query("SELECT * FROM product_status", (err, rows) => {
    if (err) {
      console.error("Error fetching product statuses:", err);
      return res.status(500).json({ error: "Failed to fetch product statuses" });
    }
    res.json(rows);
  });
});

// ADD new product status
router.post("/", (req, res) => {
  const { product_name, status } = req.body;

  db.query(
    "INSERT INTO product_status (product_name, status) VALUES (?, ?)",
    [product_name, status],
    (err, result) => {
      if (err) {
        console.error("Error adding product status:", err);
        return res.status(500).json({ error: "Failed to add product status" });
      }
      res.json({ id: result.insertId, product_name, status });
    }
  );
});

// UPDATE product status
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { status, product_name } = req.body;

  db.query(
    "UPDATE product_status SET status = ?, product_name = ? WHERE id = ?",
    [status, product_name, id],
    (err) => {
      if (err) {
        console.error("Error updating product status:", err);
        return res.status(500).json({ error: "Failed to update product status" });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
