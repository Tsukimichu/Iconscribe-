const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===================================================
// Ensure uploads folder exists
// ===================================================
const uploadDir = path.join(__dirname, "../uploads/orderfiles");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ===================================================
// Multer Configuration for Order Uploads
// ===================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  },
});

// ===================================================
// Serve uploads folder so images are accessible
// ===================================================
router.use("/uploads", express.static(uploadDir));

// ===================================================
// Serve uploads folder so images are accessible
// ===================================================
router.use("/uploads", express.static(uploadDir));

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

    const [orderResult] = await db
      .promise()
      .execute(
        "INSERT INTO orders (user_id, order_date, total) VALUES (?, NOW(), ?)",
        [user_id, 0]
      );

    const order_id = orderResult.insertId;

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

    res.json({
      success: true,
      message: "Order placed successfully!",
      order_id,
      order_item_id,  
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ success: false, message: "Database error", error: error.message });
  }
});

// ===================================================
// Upload SINGLE File
// ===================================================
router.post("/upload/single/:orderItemId", upload.single("file1"), async (req, res) => {
  const { orderItemId } = req.params;

  if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

  const filePath = `/uploads/orderfiles/${req.file.filename}`;

  try {
    // updated column name to file1
    const [result] = await db
      .promise()
      .execute("UPDATE orderitems SET file1 = ? WHERE order_item_id = ?", [filePath, orderItemId]);

    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Order item not found" });

    res.json({ success: true, message: "File uploaded successfully!", filePath });
  } catch (err) {
    console.error("❌ Error updating order item:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// Upload DOUBLE Files
// ===================================================
router.post(
  "/upload/double/:orderItemId",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    const { orderItemId } = req.params;

    const file1Path = req.files["file1"] ? `/uploads/orderfiles/${req.files["file1"][0].filename}` : null;
    const file2Path = req.files["file2"] ? `/uploads/orderfiles/${req.files["file2"][0].filename}` : null;

    try {
      // updated column names to file1, file2
      const [result] = await db
        .promise()
        .execute("UPDATE orderitems SET file1 = ?, file2 = ? WHERE order_item_id = ?", [
          file1Path,
          file2Path,
          orderItemId,
        ]);

      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Order item not found" });

      res.json({ success: true, message: "Files uploaded successfully!", file1Path, file2Path });
    } catch (err) {
      console.error("❌ Error updating order item:", err);
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
        oi.file1,
        oi.file2
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
// UPDATE PRICE
// ===================================================
router.put("/:orderId/price", async (req, res) => {
  const { orderId } = req.params;
  const { price } = req.body;

  if (price == null || isNaN(price)) {
    return res.status(400).json({ success: false, message: "Invalid price" });
  }

  try {
    const [result] = await db
      .promise()
      .execute("UPDATE orders SET total = ? WHERE order_id = ?", [price, orderId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Price updated successfully" });
  } catch (error) {
    console.error("❌ Error updating price:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});



// ===================================================
// Update Order Status
// ===================================================
router.put("/:id/status", async (req, res) => {
  const { id } = req.params; // this is your order_item_id or order_id depending on your setup
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required" });
  }

  try {
    // 1️⃣ Update orderitems status
    await db.promise().query(
      "UPDATE orderitems SET status=? WHERE order_id=?",
      [status, id]
    );

    // 2️⃣ Only if status is Completed, add to sales
    if (status === "Completed") {
      const orderId = id; // make sure this matches your order_id

      // ✅ Insert into sales logic here
      const [order] = await db.promise().query(
        "SELECT total, order_id FROM orders WHERE order_id = ?",
        [orderId]
      );

      if (order.length === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const [orderItems] = await db.promise().query(
        `SELECT oi.order_item_id, p.product_name, oi.quantity
        FROM orderitems oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?`,
        [orderId]
      );

      // Combine item names as a string
      const itemNames = orderItems.map(i => `${i.product_name} x${i.quantity}`).join(", ");


      await db.promise().query(
        "INSERT INTO sales (order_item_id, item, amount, date) VALUES (?, ?, ?, NOW())",
        [orderId, itemNames, order[0].total]
      );
    }

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
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
  const { id } = req.params;

  try {
    // Fetch order info
    const [orderRows] = await db.promise().query(
      `SELECT 
        o.order_id,
        o.order_date AS dateOrdered,
        o.total AS price,
        oi.status,
        u.name AS customer_name,
        u.email,
        u.phone AS contact_number,
        u.address AS location
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      JOIN orderitems oi ON o.order_id = oi.order_id
      WHERE o.order_id = ?
      `,
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Fetch order items
    const [itemRows] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        p.product_name AS service,
        oi.quantity,
        oi.urgency,
        oi.status,
        oi.custom_details,
        oi.file1,
        oi.file2
      FROM orderitems oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?`,
      [id]
    );

    // Format details and file paths
    const items = itemRows.map((item) => ({
      ...item,
      details: item.custom_details ? JSON.parse(item.custom_details) : {},
      files: [item.file1, item.file2].filter(Boolean),
    }));

    res.json({
      success: true,
      order: {
        ...orderRows[0],
        items,
      },
    });
  } catch (error) {
    console.error(" Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
