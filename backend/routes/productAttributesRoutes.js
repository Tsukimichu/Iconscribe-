const express = require("express");
const router = express.Router();
const db = require("../models/db");

// =======================================================
// GET /attributes → list attributes + options WITH PRICE
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
        ao.option_value,
        ao.price
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
        map.get(row.attribute_id).options.push({
          option_value: row.option_value,
          price: row.price ?? 0,
        });
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
// body: { attribute_name, option_value, price?, input_type?, required? }
// =======================================================
router.post("/", async (req, res) => {
  try {
    const {
      attribute_name,
      option_value,
      price = 0,
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
        "INSERT INTO attribute_options (attribute_id, option_value, price) VALUES (?, ?, ?)",
        [attribute_id, option_value.trim(), Number(price) || 0]
      );

    res.json({ success: true, attribute_id });
  } catch (err) {
    console.error("❌ POST /attributes error:", err);
    res.status(500).json({ error: "Failed to create attribute" });
  }
});

// =======================================================
// POST /attributes/:name/options → add option with price
// body: { option_value, price? }
// =======================================================
router.post("/:name/options", async (req, res) => {
  try {
    const { name } = req.params;
    const { option_value, price = 0 } = req.body;

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
        "INSERT INTO attribute_options (attribute_id, option_value, price) VALUES (?, ?, ?)",
        [attribute_id, option_value.trim(), Number(price) || 0]
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
        ao.option_value,
        ao.price
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
        map.get(row.attribute_id).options.push({
          option_value: row.option_value,
          price: row.price ?? 0,
        });
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

// =======================================================
// PUT /attributes/:attributeName/options/:oldValue → update price only
// body: { price }
// =======================================================
router.put("/:attributeName/options/:oldValue", async (req, res) => {
  try {
    const { attributeName, oldValue } = req.params;
    const { price } = req.body;

    if (price === undefined || price === null) {
      return res.status(400).json({ error: "price is required" });
    }

    const [rows] = await db
      .promise()
      .query(
        "SELECT attribute_id FROM attributes WHERE attribute_name = ? LIMIT 1",
        [attributeName]
      );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Attribute not found" });
    }

    const attribute_id = rows[0].attribute_id;

    const [result] = await db
      .promise()
      .query(
        `
          UPDATE attribute_options 
          SET price = ?
          WHERE attribute_id = ? AND option_value = ?
        `,
        [Number(price) || 0, attribute_id, oldValue]
      );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Option not found for this attribute" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ PUT /attributes/:attributeName/options/:oldValue", err);
    res.status(500).json({ error: "Failed to update attribute option" });
  }
});


// GET all attributes + options for specific product
router.get("/product/:productId/options", async (req, res) => {
  const { productId } = req.params;

  const sql = `
    SELECT 
        pa.attribute_name,
        pa.input_type,
        pa.required,
        pao.option_value,
        pao.price
    FROM product_attributes pa
    JOIN product_attributes_map pam 
        ON pa.attribute_name = pam.attribute_name
    LEFT JOIN product_attribute_options pao 
        ON pa.attribute_name = pao.attribute_name
    WHERE pam.product_id = ?
    ORDER BY pa.attribute_name ASC
  `;

  try {
    const [rows] = await db.promise().query(sql, [productId]);

    // group by attribute_name
    const grouped = {};
    rows.forEach((r) => {
      if (!grouped[r.attribute_name]) {
        grouped[r.attribute_name] = {
          attribute_name: r.attribute_name,
          input_type: r.input_type,
          required: r.required,
          options: [],
        };
      }

      if (r.option_value) {
        grouped[r.attribute_name].options.push({
          option_value: r.option_value,
          price: r.price,
        });
      }
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.log("❌ product attribute option error:", err);
    res.status(500).json({ error: "Failed to load product attribute options" });
  }
});

// =======================================================
// GET /attributes/product/:id/full
// returns full attributes + all options + which ones selected
// =======================================================
router.get("/product/:id/full", async (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      a.attribute_id,
      a.attribute_name,
      a.input_type,
      ao.option_id,
      ao.option_value,
      ao.price,
      paom.option_id AS selected
    FROM attributes a
    LEFT JOIN attribute_options ao ON a.attribute_id = ao.attribute_id
    LEFT JOIN product_attribute_option_map paom 
        ON paom.option_id = ao.option_id AND paom.product_id = ?
    WHERE a.attribute_id IN (
      SELECT attribute_id FROM product_attributes WHERE product_id = ?
    )
    ORDER BY a.attribute_id, ao.option_value;
  `;

  try {
    const [rows] = await db.promise().query(sql, [id, id]);

    const grouped = {};

    rows.forEach(r => {
      if (!grouped[r.attribute_id]) {
        grouped[r.attribute_id] = {
          attribute_id: r.attribute_id,
          attribute_name: r.attribute_name,
          input_type: r.input_type,
          options: []
        };
      }

      grouped[r.attribute_id].options.push({
        option_id: r.option_id,
        option_value: r.option_value,
        price: r.price,
        selected: !!r.selected
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed loading product attribute data" });
  }
});


// =======================================================
// PUT /attributes/product/:id/options
// body: { selectedOptions: [{attribute_id, option_id}] }
// =======================================================
router.put("/product/:id/options", async (req, res) => {
  const { id } = req.params;
  const { selectedOptions } = req.body;

  try {
    // Reset all options for that product
    await db.promise().query(
      "DELETE FROM product_attribute_option_map WHERE product_id = ?",
      [id]
    );

    // Insert new selected options
    if (selectedOptions.length > 0) {
      const values = selectedOptions.map(o => [
        id,
        o.attribute_id,
        o.option_id
      ]);

      await db.promise().query(
        "INSERT INTO product_attribute_option_map (product_id, attribute_id, option_id) VALUES ?",
        [values]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Save product options error:", err);
    res.status(500).json({ error: "Failed to save product options" });
  }
});


module.exports = router;