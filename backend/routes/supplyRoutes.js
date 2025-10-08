const express = require("express");
const router = express.Router();
const db = require("../models/db");

// GET all supplies
router.get("/", (req, res) => {
  db.query("SELECT * FROM supplies", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET supply by ID (optional)
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM supplies WHERE supply_id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Supply not found" });
    res.json(results[0]);
  });
});

// ADD supply
router.post("/", (req, res) => {
  const { supply_name, quantity, price, status } = req.body;
  if (
    !supply_name ||
    typeof quantity === "undefined" ||
    typeof price === "undefined" ||
    !status
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const qty = Number(quantity);
  const prc = Number(price);
  db.query(
    "INSERT INTO supplies (supply_name, quantity, price, status) VALUES (?, ?, ?, ?)",
    [supply_name, qty, prc, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ supply_id: result.insertId, supply_name, quantity: qty, price: prc, status });
    }
  );
});

// UPDATE supply
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { supply_name, quantity, price, status } = req.body;
  if (
    !supply_name ||
    typeof quantity === "undefined" ||
    typeof price === "undefined" ||
    !status
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const qty = Number(quantity);
  const prc = Number(price);
  db.query(
    "UPDATE supplies SET supply_name=?, quantity=?, price=?, status=? WHERE supply_id=?",
    [supply_name, qty, prc, status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ supply_id: parseInt(id), supply_name, quantity: qty, price: prc, status });
    }
  );
});

// DELETE supply
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM supplies WHERE supply_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted successfully" });
  });
});

module.exports = router;
