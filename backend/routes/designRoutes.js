// backend/routes/designRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ============================================================
// SAVE DESIGN
// ============================================================
router.post("/save", async (req, res) => {
  try {
    const { user_id, design_name, preview_image, json } = req.body;

    if (!user_id || !design_name || !preview_image || !json) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
        received: req.body,
      });
    }

    const sql = `
      INSERT INTO designs (user_id, design_name, preview_image, json_data)
      VALUES (?, ?, ?, ?)
    `;

    await db.promise().query(sql, [user_id, design_name, preview_image, json]);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ DESIGN SAVE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ============================================================
// GET ALL SAVED DESIGNS FOR A USER
// ============================================================
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [rows] = await db.promise().query(
      "SELECT design_id, design_name, preview_image, json_data, created_at FROM designs WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    res.json({
      success: true,
      designs: rows,
    });
  } catch (err) {
    console.error("❌ GET SAVED DESIGNS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
