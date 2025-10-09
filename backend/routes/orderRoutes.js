const express = require("express");
const router = express.Router();
const db = require("../models/db");

// 🧾 Create Order API
router.post("/create", async (req, res) => {
  try {
    const { user_id, product_id, quantity, custom_details, urgency, status } = req.body;

    // 1️⃣ Validate input
    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (user_id, product_id, quantity)",
      });
    }

    // 2️⃣ Insert into `orders`
    const [orderResult] = await db
      .promise()
      .execute(
        "INSERT INTO orders (user_id, order_date, total, status) VALUES (?, NOW(), ?, ?)",
        [user_id, 0, status || "Pending"]
      );

    const order_id = orderResult.insertId;

    // 3️⃣ Insert into `orderitems`
    await db
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

    console.log(`✅ Order placed successfully! Order ID: ${order_id}`);
    res.json({ success: true, message: "Order placed successfully!" });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message, // include for debugging
    });
  }
});

// 🧮 Get all orders (used by admin dashboard)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
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
    res.status(500).json({
      success: false,
      message: "Failed to load orders",
      error: error.message,
    });
  }
});


// 📊 Get order count per product for dashboard chart
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
    res.status(500).json({
      success: false,
      message: "Failed to load product order counts",
      error: error.message,
    });
  }
});

// Get all orders for a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await db
      .promise()
      .query(
        `SELECT 
          oi.order_item_id AS enquiryNo,
          o.order_id,
          p.product_name AS service,
          u.name AS customer_name,
          o.order_date AS dateOrdered,
          oi.urgency,
          oi.status,
          o.total AS price,
          oi.custom_details          
        FROM orderitems oi
        JOIN orders o ON oi.order_id = o.order_id
        JOIN products p ON oi.product_id = p.product_id
        JOIN users u ON o.user_id = u.user_id
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC`,
        [userId]
      );

    // parse JSON for each row
    const formatted = rows.map(row => ({
      ...row,
      details: row.custom_details ? JSON.parse(row.custom_details) : {}
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




// --- Update Price ---
router.put("/:id/price", (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  db.query("UPDATE orders SET total = ? WHERE order_id = ?", [price, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Price updated successfully" });
  });
});

// --- Update Status ---
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Status updated successfully" });
  });
});

// --- Archive Order ---
router.put("/:id/archive", (req, res) => {
  const { id } = req.params;

  db.query("UPDATE orders SET archived = 1 WHERE order_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, message: "Order archived successfully" });
  });
});

// --- Get a single order by ID ---
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch order details
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

    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Fetch associated items
    const [itemRows] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        p.product_name AS service,
        oi.urgency,
        oi.status,
        oi.custom_details
      FROM orderitems oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?`,
      [id]
    );

    // Parse custom_details JSON safely
    const items = itemRows.map(item => ({
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
