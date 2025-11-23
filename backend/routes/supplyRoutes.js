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

// GET a single supply by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM supplies WHERE supply_id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: "Supply not found" });
      res.json(results[0]);
    }
  );
});

// ADD a new supply (with category + expense_type)
router.post("/", (req, res) => {
  const {
    supply_name,
    quantity,
    price,
    unit,
    category,
    expense_type,
  } = req.body;

  if (
    !supply_name ||
    typeof quantity === "undefined" ||
    typeof price === "undefined"
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const qty = Number(quantity);
  const prc = Number(price);
  const cat = category || null;
  const type = expense_type === "Business" ? "Business" : "Material";

  db.query(
    "INSERT INTO supplies (supply_name, quantity, price, unit, category, expense_type) VALUES (?, ?, ?, ?, ?, ?)",
    [supply_name, qty, prc, unit || "", cat, type],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        supply_id: result.insertId,
        supply_name,
        quantity: qty,
        price: prc,
        unit: unit || "",
        category: cat,
        expense_type: type,
      });
    }
  );
});

// UPDATE an existing supply (used when adding stock / editing info)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    supply_name,
    quantity,
    price,
    unit,
    category,
    expense_type,
  } = req.body;

  if (
    !supply_name ||
    typeof quantity === "undefined" ||
    typeof price === "undefined"
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const qty = Number(quantity);
  const prc = Number(price);
  const cat = category || null;
  const type = expense_type === "Business" ? "Business" : "Material";

  db.query(
    "UPDATE supplies SET supply_name = ?, quantity = ?, price = ?, unit = ?, category = ?, expense_type = ? WHERE supply_id = ?",
    [supply_name, qty, prc, unit || "", cat, type, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        supply_id: parseInt(id),
        supply_name,
        quantity: qty,
        price: prc,
        unit: unit || "",
        category: cat,
        expense_type: type,
      });
    }
  );
});

// DELETE a supply
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM supplies WHERE supply_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Deleted successfully" });
  });
});

module.exports = router;
