const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Signup
router.post("/signup", (req, res) => {
  const { name, phone, email, address, password } = req.body;

  if (!name || !phone || !email || !address || !password) {
    console.log("❌ Signup failed: missing fields");
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const query = "INSERT INTO users (name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, phone, email, address, password], (err, result) => {
    if (err) {
      console.error("❌ Error inserting user:", err.message);
      return res.status(500).json({ success: false, message: "Database insert failed" });
    }
    console.log(`✅ User registered: ${name} (ID: ${result.insertId})`);
    res.json({ success: true, message: "✅ User registered successfully!" });
  });
});

// Login
router.post("/login", (req, res) => {
  const { name, password } = req.body;

  const hardcodedUsers = [
    { name: "admin", password: "admin123", role: "admin" },
    { name: "manager", password: "manager123", role: "manager" },
  ];

  const matchedUser = hardcodedUsers.find(u => u.name === name && u.password === password);
  if (matchedUser) {
    console.log(`✅ Hardcoded ${matchedUser.role} login successful: ${name}`);
    return res.json({
      success: true,
      message: `✅ ${matchedUser.role} login successful`,
      user: matchedUser,
    });
  }

  const query = "SELECT * FROM users WHERE name = ? AND password = ?";
  db.query(query, [name, password], (err, results) => {
    if (err) {
      console.error("❌ Error logging in:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      console.log(`✅ Login successful for user: ${results[0].name} (ID: ${results[0].user_id})`);
      res.json({
        success: true,
        message: "✅ Login successful",
        user: { ...results[0], role: "user" },
      });
    } else {
      console.log(`❌ Invalid login attempt: ${name}`);
      res.status(401).json({ success: false, message: "❌ Invalid name or password" });
    }
  });
});

// Update user status (Active / Suspended / Banned)
router.put("/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`🔄 Updating status for user_id ${id} to "${status}"`);

  const query = "UPDATE users SET status = ? WHERE user_id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("❌ Error updating status:", err.message);
      return res.status(500).json({ success: false, message: "Database update failed" });
    }
    console.log(`✅ Status update affected rows: ${result.affectedRows}`);
    res.json({ success: true, message: `✅ User status updated to ${status}` });
  });
});

// Archive user
router.put("/users/:id/archive", (req, res) => {
  const { id } = req.params;
  console.log(`🗄 Archiving user_id ${id}`);

  const query = "UPDATE users SET archived = 1 WHERE user_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error archiving user:", err.message);
      return res.status(500).json({ success: false, message: "Database update failed" });
    }
    console.log(`✅ Archive affected rows: ${result.affectedRows}`);
    res.json({ success: true, message: "✅ User archived" });
  });
});

// Restore user
router.put("/users/:id/restore", (req, res) => {
  const { id } = req.params;
  console.log(`♻️ Restoring user_id ${id}`);

  const query = "UPDATE users SET archived = 0 WHERE user_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error restoring user:", err.message);
      return res.status(500).json({ success: false, message: "Database update failed" });
    }
    console.log(`✅ Restore affected rows: ${result.affectedRows}`);
    res.json({ success: true, message: "✅ User restored" });
  });
});

// Get all active (non-archived) users
router.get("/users", (req, res) => {
  console.log("📋 Fetching all active users");
  const query = "SELECT * FROM users WHERE archived = 0";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err.message);
      return res.status(500).json({ success: false, message: "Database query failed" });
    }
    console.log(`✅ Active users fetched: ${results.length} rows`);
    res.json(results);
  });
});

// Get all archived users
router.get("/users/archived", (req, res) => {
  console.log("📦 Fetching all archived users");
  const query = "SELECT * FROM users WHERE archived = 1";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching archived users:", err.message);
      return res.status(500).json({ success: false, message: "Database query failed" });
    }
    console.log(`✅ Archived users fetched: ${results.length} rows`);
    res.json(results);
  });
});

module.exports = router;
