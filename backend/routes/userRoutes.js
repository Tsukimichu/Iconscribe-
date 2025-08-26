const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.post("/signup", (req, res) => {
  const { name, phone, email, address, password } = req.body;

  if (!name || !phone || !email || !address || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

    const query = "INSERT INTO users (name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)";


  db.query(query, [name, phone, email, address, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting user:", err.message);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.json({ success: true, message: "User registered successfully!" });
  });
});

router.get("/user", (req, res) => {
  const query = "SELECT * FROM user";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching user:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

module.exports = router;
