// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ========================================================
   SETUP UPLOAD FOLDER
======================================================== */
const uploadDir = path.join(__dirname, "../uploads/orderfiles");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* ========================================================
   MULTER STORAGE
======================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error("File type not allowed"));
  },
});

// NOTE: this serves files under whatever prefix this router is mounted.
// But file paths stored in DB look like `/uploads/orderfiles/...`
router.use("/uploads", express.static(uploadDir));

/* ========================================================
   HELPER: INSERT ATTRIBUTES
======================================================== */
async function insertAttributes(order_item_id, attributes) {
  if (!Array.isArray(attributes)) return;

  for (const attr of attributes) {
    if (!attr?.value) continue;

    let attributeId = attr.attribute_id || null;

    // Resolve attribute_id from attribute name
    if (!attributeId && attr.name) {
      const [rows] = await db
        .promise()
        .query(
          "SELECT attribute_id FROM attributes WHERE attribute_name=? LIMIT 1",
          [attr.name]
        );
      if (rows.length === 0) continue;
      attributeId = rows[0].attribute_id;
    }

    await db
      .promise()
      .query(
        `INSERT INTO order_item_attributes 
         (order_item_id, attribute_id, option_id, attribute_value)
         VALUES (?, ?, ?, ?)`,
        [order_item_id, attributeId, attr.option_id || null, attr.value]
      );
  }
}

/* ========================================================
   CREATE ORDER
======================================================== */
router.post("/create", async (req, res) => {
  try {
    const {
      user_id,
      product_id,
      quantity,
      urgency,
      status,
      attributes,
      estimated_price,
    } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const parsed =
      typeof attributes === "string"
        ? JSON.parse(attributes || "[]")
        : attributes;

    // Create order
    const [orderResult] = await db
      .promise()
      .query(
        "INSERT INTO orders (user_id, order_date, total) VALUES (?, NOW(), 0)",
        [user_id]
      );

    const order_id = orderResult.insertId;

    // Create order item
    const [itemResult] = await db
      .promise()
      .query(
        `INSERT INTO orderitems 
         (order_id, product_id, quantity, urgency, status, estimated_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          order_id,
          product_id,
          quantity,
          urgency || "Normal",
          status || "Pending",
          estimated_price || 0,
        ]
      );

    const order_item_id = itemResult.insertId;

    await insertAttributes(order_item_id, parsed);

    res.json({
      success: true,
      message: "Order placed!",
      order_id,
      order_item_id,
    });
  } catch (err) {
    console.error("❌ Create order error:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

/* ========================================================
   FILE UPLOADS (NOW USING order_item_files TABLE)
======================================================== */

// Single file upload → insert 1 row into order_item_files
router.post(
  "/upload/single/:id",
  upload.single("file1"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const order_item_id = req.params.id;
      const filePath = `/uploads/orderfiles/${req.file.filename}`;
      const fileType = req.file.mimetype || null;

      await db
        .promise()
        .query(
          `INSERT INTO order_item_files (order_item_id, file_path, file_type)
           VALUES (?, ?, ?)`,
          [order_item_id, filePath, fileType]
        );

      res.json({ success: true, filePath });
    } catch (err) {
      console.error("❌ upload single error:", err);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);

// Double file upload → up to 2 rows into order_item_files
router.post(
  "/upload/double/:id",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    try {
      const order_item_id = req.params.id;
      const filesToInsert = [];

      if (req.files?.file1?.[0]) {
        filesToInsert.push(req.files.file1[0]);
      }
      if (req.files?.file2?.[0]) {
        filesToInsert.push(req.files.file2[0]);
      }

      if (!filesToInsert.length) {
        return res
          .status(400)
          .json({ success: false, message: "No files uploaded" });
      }

      const paths = [];

      for (const f of filesToInsert) {
        const filePath = `/uploads/orderfiles/${f.filename}`;
        const fileType = f.mimetype || null;

        await db
          .promise()
          .query(
            `INSERT INTO order_item_files (order_item_id, file_path, file_type)
             VALUES (?, ?, ?)`,
            [order_item_id, filePath, fileType]
          );

        paths.push(filePath);
      }

      res.json({ success: true, files: paths });
    } catch (err) {
      console.error("❌ upload double error:", err);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);

/* ========================================================
   GET ALL ORDERS (MANAGER VIEW)
======================================================== */
router.get("/", async (req, res) => {
  try {
    const [items] = await db.promise().query(`
      SELECT 
        oi.order_item_id AS enquiryNo,
        o.order_id,
        p.product_name AS service,
        IFNULL(
          u.name,
          (
            SELECT oia.attribute_value 
            FROM order_item_attributes oia
            JOIN attributes a ON a.attribute_id=oia.attribute_id
            WHERE oia.order_item_id=oi.order_item_id AND a.attribute_name='Name'
            LIMIT 1
          )
        ) AS customer_name,
        o.order_date AS dateOrdered,
        oi.quantity,
        oi.urgency,
        oi.status,
        oi.estimated_price,
        o.manager_added,
        (oi.estimated_price + IFNULL(o.manager_added, 0)) AS total_price
      FROM orderitems oi
      JOIN orders o ON oi.order_id=o.order_id
      JOIN products p ON oi.product_id=p.product_id
      LEFT JOIN users u ON o.user_id=u.user_id
      ORDER BY o.order_date DESC
    `);

    const [attrs] = await db.promise().query(`
      SELECT oia.order_item_id, a.attribute_name, oia.attribute_value
      FROM order_item_attributes oia
      JOIN attributes a ON a.attribute_id=oia.attribute_id
    `);

    const merged = items.map((item) => ({
      ...item,
      details: attrs
        .filter((a) => a.order_item_id === item.enquiryNo)
        .reduce(
          (obj, row) => ({
            ...obj,
            [row.attribute_name]: row.attribute_value,
          }),
          {}
        ),
    }));

    res.json(merged);
  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ success: false, message: "Error loading orders" });
  }
});

/* ========================================================
   GET ORDER COUNTS (for charts)
======================================================== */
router.get("/product-order-counts", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT p.product_name, SUM(oi.quantity) AS total_orders
      FROM orderitems oi
      JOIN products p ON oi.product_id=p.product_id
      GROUP BY oi.product_id
      ORDER BY total_orders DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ product-order-counts error:", err);
    res.status(500).json({ success: false, message: "Error loading counts" });
  }
});

/* ========================================================
   GET ORDER BY ID (details for modal)
======================================================== */
router.get("/details/:id", async (req, res) => {
  try {
    const [order] = await db
      .promise()
      .query(
        `SELECT o.*, u.name AS customer_name, u.email, u.phone AS contact_number, u.address
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.user_id
         WHERE o.order_id = ?`,
        [req.params.id]
      );

    if (order.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const [items] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        p.product_name AS service,
        oi.quantity, oi.urgency, oi.status,
        oi.estimated_price
       FROM orderitems oi
       JOIN products p ON oi.product_id=p.product_id
       WHERE oi.order_id=?`,
      [req.params.id]
    );

    // Attach attributes + files from order_item_files
    for (let item of items) {
      const [attrs] = await db.promise().query(
        `SELECT a.attribute_name, oia.attribute_value
         FROM order_item_attributes oia
         JOIN attributes a ON a.attribute_id=oia.attribute_id
         WHERE oia.order_item_id=?`,
        [item.enquiryNo]
      );

      const [files] = await db
        .promise()
        .query(
          "SELECT file_path FROM order_item_files WHERE order_item_id=?",
          [item.enquiryNo]
        );

      item.details = attrs.reduce(
        (acc, a) => ({ ...acc, [a.attribute_name]: a.attribute_value }),
        {}
      );
      item.files = files.map((f) => f.file_path);
    }

    res.json({ success: true, order: { ...order[0], items } });
  } catch (err) {
    console.error("❌ Order details error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ========================================================
   UPDATE PRICE (manager adds extra)
======================================================== */
router.put("/:orderId/price", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { price } = req.body;

    if (isNaN(price)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid price" });
    }

    const [[sum]] = await db
      .promise()
      .query(
        "SELECT SUM(estimated_price) AS items_total FROM orderitems WHERE order_id=?",
        [orderId]
      );

    const [[curr]] = await db
      .promise()
      .query(
        "SELECT manager_added FROM orders WHERE order_id=?",
        [orderId]
      );

    const updated = Number(curr.manager_added || 0) + Number(price);
    const total = Number(sum.items_total || 0) + updated;

    await db
      .promise()
      .query("UPDATE orders SET manager_added=?, total=? WHERE order_id=?", [
        updated,
        total,
        orderId,
      ]);

    res.json({ success: true, total, manager_added: updated });
  } catch (err) {
    console.error("❌ update price error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ========================================================
   UPDATE STATUS + AUTO SALE (aligned with sales table)
======================================================== */
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // update order item status
    await db
      .promise()
      .query("UPDATE orderitems SET status=? WHERE order_item_id=?", [
        status,
        id,
      ]);

    const [[item]] = await db.promise().query(
      `SELECT 
         oi.order_id, 
         o.user_id, 
         p.product_name, 
         oi.quantity,
         (oi.estimated_price + IFNULL(o.manager_added, 0)) AS final_amount
       FROM orderitems oi
       JOIN orders o ON oi.order_id=o.order_id
       JOIN products p ON oi.product_id=p.product_id
       WHERE oi.order_item_id=?`,
      [id]
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Order item not found" });
    }

    // Only create sale when marked Completed
    if (status !== "Completed") {
      return res.json({
        success: true,
        message: "Status updated (no sales entry).",
      });
    }

    // Check for duplicate sale
    const [exists] = await db
      .promise()
      .query("SELECT id FROM sales WHERE order_item_id=? LIMIT 1", [id]);

    if (exists.length > 0) {
      return res.json({
        success: true,
        message: "Status updated. Sale already exists.",
      });
    }

    // ✅ Align with current `sales` table:
    // columns: id, order_item_id, quantity, amount, date  (no `item` column)
    await db
      .promise()
      .query(
        `INSERT INTO sales (order_item_id, quantity, amount, date)
         VALUES (?, ?, ?, CURDATE())`,
        [id, item.quantity, item.final_amount]
      );

    return res.json({
      success: true,
      message: "Status updated & sale created.",
    });
  } catch (err) {
    console.error("❌ Status update error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating status.",
    });
  }
});

/* ========================================================
   CANCEL ORDER (within 24 hours)
======================================================== */
router.post("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const [[item]] = await db.promise().query(
      `SELECT oi.order_item_id, o.order_date
       FROM orderitems oi
       JOIN orders o ON oi.order_id=o.order_id
       WHERE oi.order_item_id=?`,
      [id]
    );

    if (!item) {
      return res.status(404).json({ message: "Order not found" });
    }

    const diff = new Date() - new Date(item.order_date);
    if (diff > 24 * 60 * 60 * 1000) {
      return res
        .status(400)
        .json({ message: "Cannot cancel after 24 hours" });
    }

    await db
      .promise()
      .query("UPDATE orderitems SET status='Cancelled' WHERE order_item_id=?", [
        id,
      ]);

    res.json({ success: true, message: "Order cancelled" });
  } catch (err) {
    console.error("❌ Cancel order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ========================================================
   EDIT ORDER (within 12 hours)
======================================================== */
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, urgency, attributes } = req.body;

    const [[item]] = await db.promise().query(
      `SELECT o.order_date
       FROM orderitems oi
       JOIN orders o ON oi.order_id=o.order_id
       WHERE oi.order_item_id=?`,
      [id]
    );

    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    const diff = new Date() - new Date(item.order_date);

    if (diff > 12 * 60 * 60 * 1000) {
      return res.status(403).json({ message: "Editing time expired" });
    }

    await db
      .promise()
      .query(
        "UPDATE orderitems SET quantity=?, urgency=? WHERE order_item_id=?",
        [quantity, urgency, id]
      );

    await db
      .promise()
      .query("DELETE FROM order_item_attributes WHERE order_item_id=?", [id]);

    await insertAttributes(id, attributes);

    res.json({ success: true, message: "Order updated" });
  } catch (err) {
    console.error("❌ Edit order error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
