const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.post("/signup", (req, res) => {
  const { name, phone, email, address, password } = req.body;

  if (!name || !phone || !email || !address || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const query = "INSERT INTO users (name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, phone, email, address, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting user:", err.message);
      return res.status(500).json({ success: false, message: "Database insert failed" });
    }
    res.json({ success: true, message: "✅ User registered successfully!" });
  });
});

router.post("/login", (req, res) => {
  const { name, password } = req.body;
  console.log("Login attempt:", name);

  const query = "SELECT * FROM users WHERE name = ? AND password = ?";
  db.query(query, [name, password], (err, results) => {
    if (err) {
      console.error("❌ Error logging in:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      console.log("✅ Login successful for:", results[0].name);
      res.json({ success: true, message: "✅ Login successful", user: results[0] });
    } else {
      console.log("❌ Invalid login for:", name);
      res.status(401).json({ success: false, message: "❌ Invalid name or password" });
    }
  });
});

router.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err.message);
      return res.status(500).json({ success: false, message: "Database query failed" });
    }
    res.json(results);
  });
});

module.exports = router;
