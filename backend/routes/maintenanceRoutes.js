const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.post("/maintenance/on", (req, res) => {
  const { user_id, message, end_time, show_countdown } = req.body;

  const query = `
    INSERT INTO maintenance (user_id, is_maintenance_mode, message, end_time, show_countdown)
    VALUES (?, true, ?, ?, ?)
  `;
  db.query(query, [user_id, message, end_time, show_countdown], (err, result) => {
    if (err) {
      console.error("❌ Error enabling maintenance:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "✅ Maintenance mode ON" });
  });
});

router.post("/maintenance/off", (req, res) => {
  const { user_id } = req.body;

  const query = "INSERT INTO maintenance (user_id, is_maintenance_mode) VALUES (?, false)";
  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("❌ Error disabling maintenance:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "✅ Website is back online" });
  });
});

router.get("/maintenance/status", (req, res) => {
  const query = `
    SELECT is_maintenance_mode, message, end_time, show_countdown, createdAt
    FROM maintenance
    ORDER BY createdAt DESC
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error checking maintenance:", err.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (results.length > 0) {
      res.json({
        success: true,
        maintenance: results[0].is_maintenance_mode,
        message: results[0].message,
        endTime: results[0].end_time,
        showCountdown: results[0].show_countdown,
      });
    } else {
      res.json({ success: true, maintenance: false });
    }
  });
});

module.exports = router;
