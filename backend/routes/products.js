const express = require("express");
const router = express.Router();
const db = require("../models/db");
const upload = require("../middleware/uploadProduct"); // multer for /uploads/products

// helper
function normalizeStatus(status) {
  if (!status) return "Active";
  const s = status.toLowerCase();
  if (s === "inactive") return "Inactive";
  if (s === "archived") return "Archived";
  return "Active";
}

// ====================================================
// GET all products
// ====================================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM products");

    // attach full image url
    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "") || "http://localhost:5000";

    const patched = rows.map((p) => ({
      ...p,
      image_url: p.image ? `${base}/uploads/products/${p.image}` : null,
    }));

    res.json(patched);
  } catch (err) {
    console.error("❌ GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ====================================================
// GET single product + attributes + options
// ====================================================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [productRows] = await db
      .promise()
      .query("SELECT * FROM products WHERE product_id = ?", [id]);

    if (productRows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productRows[0];

    // 📌 FIX: Build full image URL
    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "") || "http://localhost:5000";
    const image_url = product.image ? `${base}/uploads/products/${product.image}` : null;

    // Debug logs
    console.log("📦 Product:", product);
    console.log("🖼 Raw filename:", product.image);
    console.log("🌍 Base URL:", base);
    console.log("🔗 image_url:", image_url);

    const [attrRows] = await db.promise().query(
      `
      SELECT 
        a.attribute_id,
        a.attribute_name,
        a.input_type,
        a.required,
        ao.option_value
      FROM product_attributes pa
      JOIN attributes a ON pa.attribute_id = a.attribute_id
      LEFT JOIN attribute_options ao ON ao.attribute_id = a.attribute_id
      WHERE pa.product_id = ?
      ORDER BY a.attribute_name, ao.option_value
      `,
      [id]
    );

    const attrMap = new Map();

    for (const row of attrRows) {
      if (!attrMap.has(row.attribute_id)) {
        attrMap.set(row.attribute_id, {
          attribute_id: row.attribute_id,
          attribute_name: row.attribute_name,
          input_type: row.input_type,
          required: !!row.required,
          options: [],
        });
      }
      if (row.option_value) {
        attrMap.get(row.attribute_id).options.push(row.option_value);
      }
    }

    console.log("🔧 Attributes:", Array.from(attrMap.values()));

    res.json({
      ...product,
      image_url,
      attributes: Array.from(attrMap.values()),
    });
  } catch (err) {
    console.error("❌ GET /products/:id error:", err);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

// ====================================================
// ADD new product  (with image)
// ====================================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { product_name, product_type, description, status } = req.body;
    const image = req.file ? req.file.filename : null;

    const dbStatus = normalizeStatus(status);

    const [result] = await db.promise().query(
      `
      INSERT INTO products
        (product_name, description, category, base_price, formula_type, status, image, product_type, is_back_to_back, is_pickup_required)
      VALUES (?, ?, NULL, 0.00, 'per_quantity', ?, ?, ?, ?, ?)

      `,
      [product_name, description || null, dbStatus, image, product_type || "General"]
    );

    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "") || "http://localhost:5000";

    res.json({
      product_id: result.insertId,
      product_name,
      description,
      status: dbStatus,
      image,
      image_url: image ? `${base}/uploads/products/${image}` : null,
      product_type: product_type || "General",
    });
  } catch (err) {
    console.error("❌ POST /products error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ====================================================
// UPDATE product info (no image)
// ====================================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      description,
      product_type,
      status,
      is_back_to_back,
      is_pickup_required,
    } = req.body;

    const dbStatus = normalizeStatus(status);

    const backToBack = is_back_to_back ? 1 : 0;
    const pickupRequired = is_pickup_required ? 1 : 0;

    await db
      .promise()
      .query(
        `
        UPDATE products
        SET 
          product_name = ?, 
          description = ?, 
          product_type = ?, 
          status = ?,
          is_back_to_back = ?,
          is_pickup_required = ?
        WHERE product_id = ?
        `,
        [
          product_name,
          description || null,
          product_type || "General",
          dbStatus,
          backToBack,
          pickupRequired,
          id,
        ]
      );

    const [rows] = await db
      .promise()
      .query("SELECT * FROM products WHERE product_id = ?", [id]);

    const base =
      process.env.CLIENT_ORIGIN?.replace(/\/$/, "") ||
      "http://localhost:5000";
    rows[0].image_url = rows[0].image
      ? `${base}/uploads/products/${rows[0].image}`
      : null;

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ PUT /products/:id error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});


// ====================================================
// UPDATE product image
// ====================================================
router.put("/:id/image", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    await db
      .promise()
      .query("UPDATE products SET image = ? WHERE product_id = ?", [
        image,
        id,
      ]);

    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "") || "http://localhost:5000";

    res.json({
      success: true,
      image,
      image_url: `${base}/uploads/products/${image}`,
    });
  } catch (err) {
    console.error("❌ PUT /products/:id/image error:", err);
    res.status(500).json({ error: "Failed to update image" });
  }
});

// ====================================================
// UPDATE product status ONLY
// ====================================================
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const dbStatus = (status || "").toLowerCase() === "inactive"
      ? "Inactive"
      : "Active";

    await db.promise().query(
      "UPDATE products SET status = ? WHERE product_id = ?",
      [dbStatus, id]
    );

    const [[updated]] = await db
      .promise()
      .query("SELECT * FROM products WHERE product_id = ?", [id]);

    const base =
      process.env.CLIENT_ORIGIN?.replace(/\/$/, "") ||
      "http://localhost:5000";

    updated.image_url = updated.image
      ? `${base}/uploads/products/${updated.image}`
      : null;

    res.json({
      success: true,
      message: "Status updated successfully",
      product: updated,
    });
  } catch (err) {
    console.error("❌ PUT /products/:id/status error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});


module.exports = router;