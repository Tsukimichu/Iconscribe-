const express = require("express");
const router = express.Router();
const db = require("../models/db");

// CREATE DESIGN
router.post("/save", async (req, res) => {
  try {
    const { user_id, design_name, preview_image, json } = req.body;

    if (!user_id || !design_name || !preview_image || !json) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const sql = `
      INSERT INTO designs (user_id, design_name, preview_image, json_data)
      VALUES (?, ?, ?, ?)
    `;

    await db.promise().query(sql, [
      user_id,
      design_name,
      preview_image,
      json,
    ]);

    res.json({ success: true, message: "Design saved successfully" });
  } catch (err) {
    console.error("❌ DESIGN SAVE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// UPDATE DESIGN
router.put("/update/:design_id", async (req, res) => {
  try {
    const { design_id } = req.params;
    const { design_name, preview_image, json } = req.body;

    if (!design_id || !design_name || !preview_image || !json) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const sql = `
      UPDATE designs
      SET design_name = ?, preview_image = ?, json_data = ?
      WHERE design_id = ?
    `;

    await db.promise().query(sql, [
      design_name,
      preview_image,
      json,
      design_id,
    ]);

    res.json({ success: true, message: "Design updated successfully" });
  } catch (err) {
    console.error("❌ DESIGN UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ❗ MOVE DELETE BEFORE GET
// DELETE DESIGN
router.delete("/delete/:design_id", async (req, res) => {
  try {
    const { design_id } = req.params;

    if (!design_id)
      return res
        .status(400)
        .json({ success: false, message: "Missing design_id" });

    const sql = `DELETE FROM designs WHERE design_id = ?`;

    await db.promise().query(sql, [design_id]);

    res.json({ success: true, message: "Design deleted successfully" });
  } catch (err) {
    console.error("❌ DESIGN DELETE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET ALL DESIGNS
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const [rows] = await db.promise().query(
      `
      SELECT design_id, user_id, design_name, preview_image, json_data, created_at
      FROM designs
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
      [user_id]
    );

    res.json({ success: true, designs: rows });
  } catch (err) {
    console.error("❌ GET DESIGNS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
