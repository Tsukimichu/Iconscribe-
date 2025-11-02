const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Create session when user logs in
router.post("/", (req, res) => {
  const { user_id, session_token } = req.body;

  if (!user_id || !session_token) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const sql = "INSERT INTO sessions (user_id, session_token) VALUES (?, ?)";
  db.query(sql, [user_id, session_token], (err, result) => {
    if (err) {
      console.error("Error creating session:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, session_id: result.insertId });
  });
});

// Optional: get all sessions (for testing)
router.get("/", (req, res) => {
  db.query("SELECT * FROM sessions", (err, result) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(result);
  });
});

// Delete session (logout)
router.delete("/:user_id", (req, res) => {
  const { user_id } = req.params;

  db.query("DELETE FROM sessions WHERE user_id = ?", [user_id], (err) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Session deleted" });
  });
});

module.exports = router;
