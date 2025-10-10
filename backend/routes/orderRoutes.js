const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");
const path = require("path");

// ===================================================
// Multer Configuration for Order Uploads
// ===================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/orderfiles/"); // Store inside uploads/orderfiles/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// ===================================================
// CREATE NEW ORDER
// ===================================================
router.post("/create", async (req, res) => {
  try {
    const { user_id, product_id, quantity, custom_details, urgency, status } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (user_id, product_id, quantity)",
      });
    }

    // Insert into `orders`
    const [orderResult] = await db
      .promise()
      .execute(
        "INSERT INTO orders (user_id, order_date, total, status) VALUES (?, NOW(), ?, ?)",
        [user_id, 0, status || "Pending"]
      );

    const order_id = orderResult.insertId;

    // Insert into `orderitems`
    const [orderItemResult] = await db
      .promise()
      .execute(
        `INSERT INTO orderitems 
         (order_id, product_id, quantity, urgency, status, custom_details) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          order_id,
          product_id,
          quantity,
          urgency || "Normal",
          status || "Pending",
          JSON.stringify(custom_details || {}),
        ]
      );

    const order_item_id = orderItemResult.insertId;

    console.log(`✅ Order created: order_id=${order_id}, item_id=${order_item_id}`);

    res.json({
      success: true,
      message: "Order placed successfully!",
      order_id,
      order_item_id,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
});

// ===================================================
// Upload SINGLE Image (Binding, Book, Raffle Ticket)
// ===================================================
router.post("/upload/single/:orderItemId", upload.single("image1"), async (req, res) => {
  const { orderItemId } = req.params;
  const imagePath = req.file ? `/uploads/orderfiles/${req.file.filename}` : null;

  if (!imagePath) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  try {
    await db
      .promise()
      .execute("UPDATE orderitems SET image1 = ? WHERE order_item_id = ?", [
        imagePath,
        orderItemId,
      ]);

    res.json({
      success: true,
      message: "Single image uploaded successfully!",
      imagePath,
    });
  } catch (err) {
    console.error("❌ Error updating order item image:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// Upload DOUBLE Images (Brochure, Flyers, etc.)
// ===================================================
router.post(
  "/upload/double/:orderItemId",
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  async (req, res) => {
    const { orderItemId } = req.params;

    const image1Path = req.files["image1"]
      ? `/uploads/orderfiles/${req.files["image1"][0].filename}`
      : null;
    const image2Path = req.files["image2"]
      ? `/uploads/orderfiles/${req.files["image2"][0].filename}`
      : null;

    try {
      await db
        .promise()
        .execute(
          "UPDATE orderitems SET image1 = ?, image2 = ? WHERE order_item_id = ?",
          [image1Path, image2Path, orderItemId]
        );

      res.json({
        success: true,
        message: "Double images uploaded successfully!",
        image1Path,
        image2Path,
      });
    } catch (err) {
      console.error("❌ Error updating double images:", err);
      res.status(500).json({ success: false, message: "Database error" });
    }
  }
);

// ===================================================
// Get all orders (Admin Dashboard)
// ===================================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        o.order_id,
        p.product_name AS service,
        u.name AS customer_name,
        o.order_date AS dateOrdered,
        oi.urgency,
        oi.status,
        o.total AS price
      FROM orderitems oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN users u ON o.user_id = u.user_id
      JOIN products p ON oi.product_id = p.product_id
      ORDER BY o.order_date DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to load orders" });
  }
});

// ===================================================
// Get Order Counts per Product (for charts)
// ===================================================
router.get("/product-order-counts", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        `SELECT 
          p.product_name, 
          SUM(oi.quantity) AS total_orders
        FROM orderitems oi
        JOIN products p ON oi.product_id = p.product_id
        GROUP BY oi.product_id
        ORDER BY total_orders DESC`
      );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching product order counts:", error);
    res.status(500).json({ success: false, message: "Failed to load counts" });
  }
});

// ===================================================
// Get Orders by User ID
// ===================================================
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        o.order_id,
        p.product_name AS service,
        u.name AS customer_name,
        o.order_date AS dateOrdered,
        oi.urgency,
        oi.status,
        o.total AS price,
        oi.custom_details,
        oi.image1,
        oi.image2
      FROM orderitems oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN products p ON oi.product_id = p.product_id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.user_id = ?
      ORDER BY o.order_date DESC`,
      [userId]
    );

    const formatted = rows.map((row) => ({
      ...row,
      details: row.custom_details ? JSON.parse(row.custom_details) : {},
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ===================================================
// Update Price
// ===================================================
router.put("/:id/price", (req, res) => {
  const { id } = req.params;
  const { price } = req.body;
  db.query("UPDATE orders SET total = ? WHERE order_id = ?", [price, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Price updated successfully" });
  });
});

// ===================================================
// Update Status
// ===================================================
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
});

// ===================================================
// Archive Order
// ===================================================
router.put("/:id/archive", (req, res) => {
  const { id } = req.params;
  db.query("UPDATE orders SET archived = 1 WHERE order_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Order archived successfully" });
  });
});

// ===================================================
// Get a Single Order by ID
// ===================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [orderRows] = await db.promise().query(
      `SELECT 
        o.order_id,
        u.name AS customer_name,
        u.email,
        u.phone AS contact_number,
        u.address AS location,
        o.order_date AS dateOrdered,
        o.total AS price,
        o.status
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?`,
      [id]
    );

    if (orderRows.length === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    const [itemRows] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        p.product_name AS service,
        oi.urgency,
        oi.status,
        oi.custom_details,
        oi.image1,
        oi.image2
      FROM orderitems oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?`,
      [id]
    );

    const items = itemRows.map((item) => ({
      ...item,
      details: item.custom_details ? JSON.parse(item.custom_details) : {},
    }));

    res.json({
      success: true,
      order: {
        ...orderRows[0],
        items,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
