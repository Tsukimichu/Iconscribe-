const express = require("express");
const router = express.Router();
const db = require("../models/db");

// =======================================================
// GET /attributes  → list of attributes + options
// shape: [{ attribute_id, attribute_name, input_type, required, options:[] }]
// =======================================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        a.attribute_id,
        a.attribute_name,
        a.input_type,
        a.required,
        ao.option_id,
        ao.option_value
      FROM attributes a
      LEFT JOIN attribute_options ao 
        ON ao.attribute_id = a.attribute_id
      ORDER BY a.attribute_name, ao.option_value
    `);

    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.attribute_id)) {
        map.set(row.attribute_id, {
          attribute_id: row.attribute_id,
          attribute_name: row.attribute_name,
          input_type: row.input_type,
          required: !!row.required,
          options: [],
        });
      }

      if (row.option_id) {
        map.get(row.attribute_id).options.push(row.option_value);
      }
    }

    res.json(Array.from(map.values()));
  } catch (err) {
    console.error("❌ GET /attributes error:", err);
    res.status(500).json({ error: "Failed to load attributes" });
  }
});

// =======================================================
// POST /attributes  → create attribute + first option
// body: { attribute_name, option_value, input_type?, required? }
// =======================================================
router.post("/", async (req, res) => {
  try {
    const {
      attribute_name,
      option_value,
      input_type = "select",
      required = 0,
    } = req.body;

    if (!attribute_name || !option_value) {
      return res
        .status(400)
        .json({ error: "attribute_name and option_value are required" });
    }

    const [attrResult] = await db
      .promise()
      .query(
        "INSERT INTO attributes (attribute_name, input_type, required) VALUES (?, ?, ?)",
        [attribute_name.trim(), input_type, required ? 1 : 0]
      );

    const attribute_id = attrResult.insertId;

    await db
      .promise()
      .query(
        "INSERT INTO attribute_options (attribute_id, option_value) VALUES (?, ?)",
        [attribute_id, option_value.trim()]
      );

    res.json({ success: true, attribute_id });
  } catch (err) {
    console.error("❌ POST /attributes error:", err);
    res.status(500).json({ error: "Failed to create attribute" });
  }
});

// =======================================================
// POST /attributes/:name/options → add option to existing attribute
// body: { option_value }
// =======================================================
router.post("/:name/options", async (req, res) => {
  try {
    const { name } = req.params;
    const { option_value } = req.body;

    if (!option_value) {
      return res.status(400).json({ error: "option_value is required" });
    }

    const [rows] = await db
      .promise()
      .query(
        "SELECT attribute_id FROM attributes WHERE attribute_name = ? LIMIT 1",
        [name]
      );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Attribute not found" });
    }

    const attribute_id = rows[0].attribute_id;

    await db
      .promise()
      .query(
        "INSERT INTO attribute_options (attribute_id, option_value) VALUES (?, ?)",
        [attribute_id, option_value.trim()]
      );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ POST /attributes/:name/options error:", err);
    res.status(500).json({ error: "Failed to add option" });
  }
});

// =======================================================
// GET /attributes/product/:productId → attributes used by this product
// returns: [{ attribute_id, attribute_name, input_type, required, options: [] }]
// =======================================================
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const [rows] = await db.promise().query(
      `
      SELECT 
        a.attribute_id,
        a.attribute_name,
        a.input_type,
        a.required,
        ao.option_id,
        ao.option_value
      FROM product_attributes pa
      JOIN attributes a ON pa.attribute_id = a.attribute_id
      LEFT JOIN attribute_options ao 
        ON ao.attribute_id = a.attribute_id
      WHERE pa.product_id = ?
      ORDER BY a.attribute_name, ao.option_value
      `,
      [productId]
    );

    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.attribute_id)) {
        map.set(row.attribute_id, {
          attribute_id: row.attribute_id,
          attribute_name: row.attribute_name,
          input_type: row.input_type,
          required: !!row.required,
          options: [],
        });
      }
      if (row.option_id) {
        map.get(row.attribute_id).options.push(row.option_value);
      }
    }

    res.json(Array.from(map.values()));
  } catch (err) {
    console.error("❌ GET /attributes/product/:productId error:", err);
    res.status(500).json({ error: "Failed to load product attributes" });
  }
});

// =======================================================
// PUT /attributes/product/:productId
// body: { attributes: ["Size","Paper Type", ...] }
// rewrites product_attributes for this product
// =======================================================
router.put("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { attributes } = req.body;

    if (!Array.isArray(attributes)) {
      return res
        .status(400)
        .json({ error: "attributes must be an array of names" });
    }

    await db
      .promise()
      .query("DELETE FROM product_attributes WHERE product_id = ?", [
        productId,
      ]);

    for (const name of attributes) {
      const [rows] = await db
        .promise()
        .query(
          "SELECT attribute_id FROM attributes WHERE attribute_name = ? LIMIT 1",
          [name]
        );
      if (rows.length === 0) continue;

      const attribute_id = rows[0].attribute_id;

      await db
        .promise()
        .query(
          "INSERT INTO product_attributes (product_id, attribute_id) VALUES (?, ?)",
          [productId, attribute_id]
        );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ PUT /attributes/product/:productId error:", err);
    res.status(500).json({ error: "Failed to update product attributes" });
  }
});

module.exports = router;