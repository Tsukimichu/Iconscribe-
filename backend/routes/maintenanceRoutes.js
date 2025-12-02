const express = require("express");
const router = express.Router();
const db = require("../models/db");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// ========================= ENABLE MAINTENANCE =========================
router.post("/maintenance/on", authenticate, isAdmin, async (req, res) => {
  const { message, start_time, end_time, show_countdown } = req.body;
  const user_id = req.user.id;

  try {
    await db.promise().query(
      `UPDATE maintenance
       SET user_id = ?, is_maintenance_mode = 1, message = ?, start_time = ?, end_time = ?, show_countdown = ?
       WHERE maintenance_id = 1`,
      [user_id, message || "", start_time || null, end_time || null, show_countdown ? 1 : 0]
    );

    await db.promise().query(
      "INSERT INTO maintenance_logs (action, details) VALUES (?, ?)",
      ["ON", `Set by user ${user_id}. Message: ${message}`]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Maintenance ON error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ========================= DISABLE MAINTENANCE =========================
router.post("/maintenance/off", authenticate, isAdmin, async (req, res) => {
  const user_id = req.user.id;

  try {
    await db.promise().query(
      `UPDATE maintenance
       SET user_id = ?, is_maintenance_mode = 0, message = '', start_time = NULL, end_time = NULL, show_countdown = 0
       WHERE maintenance_id = 1`,
      [user_id]
    );

    await db.promise().query(
      "INSERT INTO maintenance_logs (action, details) VALUES (?, ?)",
      ["OFF", `Turned OFF by user ${user_id}`]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Maintenance OFF error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

//============================ Logs ==========================
router.get("/maintenance/logs", authenticate, isAdmin, (req, res) => {
  db.query("SELECT * FROM maintenance_logs ORDER BY createdAt DESC", (err, results) => {
    if (err) {
      console.error("❌ Logs fetch error:", err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, logs: results });
  });
});


// ========================= GET STATUS =========================
router.get("/maintenance/status", (req, res) => {
  const sql = `
    SELECT 
      is_maintenance_mode,
      message,
      start_time,
      end_time,
      show_countdown
    FROM maintenance
    WHERE maintenance_id = 1
    LIMIT 1
  `;

  db.query(sql, async (err, results) => {
    if (err) {
      console.error("❌ Maintenance GET error:", err);
      return res.status(500).json({ success: false });
    }

    if (!results.length) {
      return res.json({
        success: true,
        maintenance: false,
        message: "",
        start_time: null,
        end_time: null,
        show_countdown: 0,
      });
    }

    let row = results[0];

    // ===== AUTO-UNLOCK LOGIC =====
    if (row.is_maintenance_mode === 1 && row.end_time) {
      const now = new Date();
      const end = new Date(row.end_time);

      if (now >= end) {
        const offSql = `
          UPDATE maintenance
          SET is_maintenance_mode = 0,
              message = '',
              start_time = NULL,
              end_time = NULL,
              show_countdown = 0
          WHERE maintenance_id = 1
        `;

        await db.promise().query(offSql);

        // Log the auto-unlock event
        await db.promise().query(
          "INSERT INTO maintenance_logs (action, details) VALUES (?, ?)",
          ["AUTO-UNLOCK", "Maintenance automatically ended based on end_time"]
        );

        // Replace row with updated values
        row.is_maintenance_mode = 0;
        row.message = "";
        row.start_time = null;
        row.end_time = null;
        row.show_countdown = 0;
      }
    }

    res.json({
      success: true,
      maintenance: row.is_maintenance_mode === 1,
      message: row.message,
      start_time: row.start_time,
      end_time: row.end_time,
      show_countdown: row.show_countdown === 1,
    });
  });
});

module.exports = router;
