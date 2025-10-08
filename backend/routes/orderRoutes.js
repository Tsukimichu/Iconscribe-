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

module.exports = router;
