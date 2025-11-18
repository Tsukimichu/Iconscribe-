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
// CREATE NEW ORDER
// ===================================================
router.post("/create", async (req, res) => {
  try {
    const { user_id, product_id, quantity, urgency, status, attributes, estimated_price } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let parsedAttributes = attributes;
    if (typeof attributes === "string") {
      try { parsedAttributes = JSON.parse(attributes); } catch { parsedAttributes = []; }
    }

    const [orderResult] = await db.promise().execute(
      "INSERT INTO orders (user_id, order_date, total) VALUES (?, NOW(), 0)",
      [user_id]
    );
    const order_id = orderResult.insertId;

    const [orderItemResult] = await db.promise().execute(
      "INSERT INTO orderitems (order_id, product_id, quantity, urgency, status, estimated_price) VALUES (?, ?, ?, ?, ?, ?)",
      [order_id, product_id, quantity, urgency || "Normal", status || "Pending", estimated_price || 0]
    );
    const order_item_id = orderItemResult.insertId;

    if (Array.isArray(parsedAttributes)) {
      for (const attr of parsedAttributes) {
        if (attr.name && attr.value) {
          try {
            await db.promise().execute(
              "INSERT INTO order_item_attributes (order_item_id, attribute_name, attribute_value) VALUES (?, ?, ?)",
              [order_item_id, attr.name, attr.value]
            );
          } catch (err) {
            console.error("❌ Error inserting attribute:", attr, err.message);
          }
        }
      }
    }

    res.json({ success: true, message: "Order placed successfully!", order_id, order_item_id, estimated_price });
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

  // Validate orderItemId
  if (!orderItemId || isNaN(orderItemId)) {
    return res.status(400).json({ success: false, message: "Invalid order item ID" });
  }

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const filePath = `/uploads/orderfiles/${req.file.filename}`;

  try {
    // Update the orderitems table
    const [result] = await db
      .promise()
      .execute("UPDATE orderitems SET file1 = ? WHERE order_item_id = ?", [filePath, orderItemId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Order item not found" });
    }

    res.json({ success: true, message: "File uploaded successfully!", filePath });
  } catch (err) {
    console.error("❌ Error updating order item:", err);
    res.status(500).json({ success: false, message: "Database error", error: err.message });
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

    // Validate orderItemId
    if (!orderItemId || isNaN(orderItemId)) {
      return res.status(400).json({ success: false, message: "Invalid order item ID" });
    }

    // Build file paths if files exist
    const file1Path = req.files["file1"]?.[0] ? `/uploads/orderfiles/${req.files["file1"][0].filename}` : null;
    const file2Path = req.files["file2"]?.[0] ? `/uploads/orderfiles/${req.files["file2"][0].filename}` : null;

    // Ensure at least one file is uploaded
    if (!file1Path && !file2Path) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    try {
      const [result] = await db
        .promise()
        .execute(
          "UPDATE orderitems SET file1 = ?, file2 = ? WHERE order_item_id = ?",
          [file1Path, file2Path, orderItemId]
        );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Order item not found" });
      }

      res.json({
        success: true,
        message: "Files uploaded successfully!",
        file1Path,
        file2Path,
      });
    } catch (err) {
      console.error("❌ Error updating order item:", err);
      res.status(500).json({ success: false, message: "Database error", error: err.message });
    }
  }
);


// Get all orders
router.get("/", async (req, res) => {
  try {
    const [orderItems] = await db.promise().query(`
      SELECT 
        oi.order_item_id AS enquiryNo,
        o.order_id,
        p.product_name AS service,
        u.name AS customer_name,
        o.order_date AS dateOrdered,
        oi.urgency,
        oi.status,
        oi.quantity,
        oi.estimated_price,
        o.manager_added,
        (oi.estimated_price + IFNULL(o.manager_added, 0)) AS total_price
      FROM orderitems oi
      JOIN orders o ON oi.order_id = o.order_id
      JOIN users u ON o.user_id = u.user_id
      JOIN products p ON oi.product_id = p.product_id
      ORDER BY o.order_date DESC
    `);

    const [attrs] = await db.promise().query(`
      SELECT order_item_id, attribute_name, attribute_value
      FROM order_item_attributes
    `);

    const merged = orderItems.map(item => {
      const itemAttrs = attrs.filter(a => a.order_item_id === item.enquiryNo);
      const details = {};
      itemAttrs.forEach(a => {
        details[a.attribute_name] = a.attribute_value;
      });
      return { ...item, details };
    });

    res.json(merged);
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
    const [rows] = await db.promise().query(`
      SELECT 
        p.product_name, 
        SUM(oi.quantity) AS total_orders
      FROM orderitems oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY oi.product_id
      ORDER BY total_orders DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ Error fetching product order counts:", error);
    res.status(500).json({ success: false, message: "Failed to load counts" });
  }
});


// ===================================================
// Get a Single Order by ID
// ===================================================
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch order header
    const [orderRows] = await db.promise().query(
      `SELECT 
        o.order_id,
        o.order_date AS dateOrdered,
        u.name AS customer_name,
        u.email,
        u.phone AS contact_number,
        u.address AS location
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?`,
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Fetch order items including estimated_price
    const [itemRows] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        p.product_name AS service,
        oi.quantity,
        oi.urgency,
        oi.status,
        oi.file1,
        oi.file2,
        oi.estimated_price
      FROM orderitems oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?`,
      [id]
    );

    // Fetch attributes safely
    const orderItemIds = itemRows.map(i => i.enquiryNo);
    let attrs = [];
    if (orderItemIds.length > 0) {
      const placeholders = orderItemIds.map(() => "?").join(",");
      [attrs] = await db.promise().query(
        `SELECT order_item_id, attribute_name, attribute_value
         FROM order_item_attributes
         WHERE order_item_id IN (${placeholders})`,
        orderItemIds
      );
    }

    // Merge attributes and files
    const items = itemRows.map(item => {
      const details = attrs
        .filter(a => a.order_item_id === item.enquiryNo)
        .reduce((acc, a) => {
          acc[a.attribute_name] = a.attribute_value;
          return acc;
        }, {});
      return { ...item, details, files: [item.file1, item.file2].filter(Boolean) };
    });

    // Calculate total from orderitems.estimated_price
    const total = items.reduce((sum, i) => sum + Number(i.estimated_price || 0), 0);

    res.json({ success: true, order: { ...orderRows[0], items, total } });
  } catch (error) {
    console.error("❌ Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// ===================================================
// UPDATE PRICE (Manager adds amount to total)
// ===================================================
router.put("/:orderId/price", async (req, res) => {
  const { orderId } = req.params;
  const { price } = req.body;

  if (price == null || isNaN(price)) {
    return res.status(400).json({ success: false, message: "Invalid price" });
  }

  try {
    // Calculate items total
    const [sumResult] = await db.promise().query(
      "SELECT SUM(estimated_price) AS items_total FROM orderitems WHERE order_id = ?",
      [orderId]
    );
    const itemsTotal = Number(sumResult[0].items_total || 0);

    // Get current manager_added
    const [current] = await db.promise().query(
      "SELECT manager_added FROM orders WHERE order_id = ?",
      [orderId]
    );

    if (current.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const updatedManagerAdded =
      Number(current[0].manager_added || 0) + Number(price);

    const finalTotal = itemsTotal + updatedManagerAdded;

    // Update table
    await db.promise().execute(
      "UPDATE orders SET manager_added = ?, total = ? WHERE order_id = ?",
      [updatedManagerAdded, finalTotal, orderId]
    );

    // ========= FIXED: Fetch user_id + product_name =========
    const [orderInfo] = await db.promise().query(
      `SELECT 
          o.user_id,
          p.product_name
       FROM orders o
       JOIN orderitems oi ON o.order_id = oi.order_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE o.order_id = ?
       LIMIT 1`,
      [orderId]
    );

    const serviceName = orderInfo[0]?.product_name || "Your Order";
    const userId = orderInfo[0]?.user_id;

    // ========= Emit Socket Notification =========
    if (req.io && userId) {
      req.io.to(userId.toString()).emit("orderPriceUpdated", {
        order_id: orderId,
        service: serviceName,
        total: finalTotal,
        manager_added: updatedManagerAdded,
        date: new Date().toISOString(),
      });

      console.log(`📢 Price update sent → user ${userId}`);
    }

    res.json({
      success: true,
      message: "Price updated successfully",
      total: finalTotal,
      manager_added: updatedManagerAdded,
    });

  } catch (err) {
    console.error("❌ Error updating price:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});





// ===================================================
// UPDATE ORDER STATUS + Move to Completed/Canceled Tables
// ===================================================
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status)
    return res.status(400).json({ success: false, message: "Status is required" });

  try {
    // Update the status
    await db.promise().query(
      "UPDATE orderitems SET status = ? WHERE order_item_id = ?",
      [status, id]
    );

    // ========= FIXED: Fetch full order info + product name =========
    const [rows] = await db.promise().query(
      `SELECT 
          oi.order_item_id AS enquiryNo,
          oi.order_id,
          o.user_id,
          p.product_name
       FROM orderitems oi
       JOIN orders o ON oi.order_id = o.order_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_item_id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    const item = rows[0];

    // Prevent duplicates
    const [alreadyCompleted] = await db.promise().query(
      `SELECT * FROM completed_orders WHERE order_item_id = ?`,
      [id]
    );

    const [alreadyCanceled] = await db.promise().query(
      `SELECT * FROM canceled_orders WHERE order_item_id = ?`,
      [id]
    );

    // Insert into Completed Table
    if (status === "Completed" && alreadyCompleted.length === 0) {
      await db.promise().query(
        `INSERT INTO completed_orders (order_item_id, order_id, user_id)
         VALUES (?, ?, ?)`,
        [item.enquiryNo, item.order_id, item.user_id]
      );
    }

    // Insert into Canceled Table
    if (status === "Cancelled" && alreadyCanceled.length === 0) {
      await db.promise().query(
        `INSERT INTO canceled_orders (order_item_id, order_id, user_id)
         VALUES (?, ?, ?)`,
        [item.enquiryNo, item.order_id, item.user_id]
      );
    }

    // ======================================================
    // AUTO-CREATE SALE RECORD WHEN STATUS = COMPLETED
    // ======================================================
    if (status === "Completed") {
      // Fetch final total price
      const [priceRows] = await db.promise().query(
        `SELECT 
            (oi.estimated_price + IFNULL(o.manager_added, 0)) AS total_price,
            p.product_name AS item
         FROM orderitems oi
         JOIN orders o ON oi.order_id = o.order_id
         JOIN products p ON oi.product_id = p.product_id
         WHERE oi.order_item_id = ?
         LIMIT 1`,
        [id]
      );

      const finalPrice = priceRows[0]?.total_price || 0;
      const itemName   = priceRows[0]?.item || "Unknown";

      // Prevent duplicate sales
      const [existingSale] = await db.promise().query(
        "SELECT id FROM sales WHERE order_item_id = ?",
        [id]
      );

      if (existingSale.length === 0) {
        await db.promise().query(
          `INSERT INTO sales (order_item_id, item, amount, date)
           VALUES (?, ?, ?, NOW())`,
          [id, itemName, finalPrice]
        );

        console.log(` Sale added for order_item_id ${id}`);
      }
    }

    // ========= SOCKET EMIT FIX =========
    if (req.io) {
      req.io.to(item.user_id.toString()).emit("orderStatusUpdated", {
        enquiryNo: item.enquiryNo,
        order_id: item.order_id,
        status,
        service: item.product_name,
        date: new Date().toISOString(),
      });

      console.log(` Status update sent → user ${item.user_id}`);
    }

    res.json({
      success: true,
      message: "Status updated + moved successfully",
      orderItem: item,
    });

  } catch (err) {
    console.error(" Status Update Error:", err);
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
        o.manager_added,
        u.name AS customer_name,
        u.email,
        u.phone AS contact_number,
        u.address AS location
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?`,
      [id]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Fetch order items with estimated_price
    const [itemRows] = await db.promise().query(
      `SELECT 
        oi.order_item_id AS enquiryNo,
        p.product_name AS service,
        oi.quantity,
        oi.urgency,
        oi.status,
        oi.estimated_price,
        oi.file1,
        oi.file2
      FROM orderitems oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?`,
      [id]
    );

    const orderItemIds = itemRows.map(i => i.enquiryNo);
    
    // Fetch attributes for these items
    let attrs = [];
    if (orderItemIds.length > 0) {
      [attrs] = await db.promise().query(
        `SELECT order_item_id, attribute_name, attribute_value
         FROM order_item_attributes
         WHERE order_item_id IN (?)`,
        [orderItemIds]
      );
    }

    // Merge attributes into items
    const items = itemRows.map(item => {
      const details = attrs
        .filter(a => a.order_item_id === item.enquiryNo)
        .reduce((acc, a) => {
          acc[a.attribute_name] = a.attribute_value;
          return acc;
        }, {});
      return { ...item, details, files: [item.file1, item.file2].filter(Boolean) };
    });

    res.json({
      success: true,
      order: {
        ...orderRows[0],
        items,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching order details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===================================================
// Get Orders by User ID (Normalized Attributes)
// ===================================================
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch order items for the user
    const [items] = await db.promise().query(
      `SELECT 
          oi.order_item_id AS enquiryNo,
          o.order_id,
          p.product_name AS service,
          u.name AS customer_name,
          o.order_date AS dateOrdered,
          oi.urgency,
          oi.status,
          oi.quantity,
          oi.estimated_price,
          o.total AS price,
          oi.file1,
          oi.file2
       FROM orderitems oi
       JOIN orders o ON oi.order_id = o.order_id
       JOIN users u ON o.user_id = u.user_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE o.user_id = ?
       ORDER BY o.order_date DESC`,
      [userId]
    );

    const orderItemIds = items.map(i => i.enquiryNo);

    // Fetch attributes for these items
    let attrs = [];
    if (orderItemIds.length > 0) {
      [attrs] = await db.promise().query(
        `SELECT order_item_id, attribute_name, attribute_value
         FROM order_item_attributes
         WHERE order_item_id IN (?)`,
        [orderItemIds]
      );
    }

    // Group items with their attributes
    const grouped = {};
    for (const item of items) {
      grouped[item.enquiryNo] = {
        ...item,
        details: {},
        files: [item.file1, item.file2].filter(Boolean),
      };
    }

    for (const attr of attrs) {
      if (grouped[attr.order_item_id]) {
        grouped[attr.order_item_id].details[attr.attribute_name] = attr.attribute_value;
      }
    }

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ===================================================
// CANCEL ORDER within 24 hours + Emit Notification
// ===================================================
router.post("/:id/cancel", async (req, res) => {
  const { id } = req.params;

  try {
    const [item] = await db.promise().query(
      `SELECT oi.order_item_id, oi.status, o.order_date, o.user_id, p.product_name
       FROM orderitems oi
       JOIN orders o ON oi.order_id = o.order_id
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_item_id = ?`,
      [id]
    );

    if (item.length === 0)
      return res.status(404).json({ message: "Order item not found" });

    const orderTime = new Date(item[0].order_date);
    const now = new Date();
    if (now - orderTime > 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: "Cannot cancel after 24 hours" });
    }

    await db.promise().query(
      "UPDATE orderitems SET status = 'Cancelled' WHERE order_item_id = ?",
      [id]
    );

    // Emit real-time notification to user
    if (req.io) {
      req.io.to(item[0].user_id.toString()).emit("orderStatusUpdated", {
        enquiryNo: item[0].order_item_id,
        order_id: item[0].order_id,
        status: "Cancelled",
        service: item[0].product_name,
      });
    }

    res.json({ message: "Order item cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/edit/:orderItemId", async (req, res) => {
  const { orderItemId } = req.params;
  const { quantity, urgency, attributes } = req.body;

  try {
    // Check if still within 12 hours
    const [item] = await db.promise().query(
      `SELECT o.order_date
       FROM orderitems oi
       JOIN orders o ON oi.order_id = o.order_id
       WHERE oi.order_item_id = ?`,
      [orderItemId]
    );

    if (item.length === 0)
      return res.status(404).json({ success: false, message: "Order not found" });

    const orderTime = new Date(item[0].order_date);
    const now = new Date();

    if (now - orderTime > 12 * 60 * 60 * 1000)
      return res.status(403).json({ success: false, message: "Editing time expired" });

    // Update quantity + urgency
    await db.promise().query(
      `UPDATE orderitems 
       SET quantity = ?, urgency = ?
       WHERE order_item_id = ?`,
      [quantity, urgency, orderItemId]
    );

    // Update attributes
    if (Array.isArray(attributes)) {
      await db.promise().query(
        "DELETE FROM order_item_attributes WHERE order_item_id = ?",
        [orderItemId]
      );

      for (const attr of attributes) {
        await db.promise().query(
          `INSERT INTO order_item_attributes (order_item_id, attribute_name, attribute_value)
           VALUES (?, ?, ?)`,
          [orderItemId, attr.name, attr.value]
        );
      }
    }

    res.json({ success: true, message: "Order updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===================================================
// GET COMPLETED ORDERS (Normalized)
// ===================================================
router.get("/completed/all", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        co.completed_id,
        co.order_item_id AS enquiryNo,
        co.order_id,
        co.user_id,
        co.date_completed,
        
        p.product_name AS service,
        oi.quantity,
        oi.estimated_price,
        o.manager_added,
        
        (oi.estimated_price + IFNULL(o.manager_added, 0)) AS total_price,
        u.name AS customer_name
      FROM completed_orders co
      JOIN orderitems oi ON co.order_item_id = oi.order_item_id
      JOIN orders o ON co.order_id = o.order_id
      JOIN users u ON co.user_id = u.user_id
      JOIN products p ON oi.product_id = p.product_id
      ORDER BY co.date_completed DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Error loading completed orders:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// ===================================================
// GET CANCELED ORDERS (Normalized)
// ===================================================
router.get("/canceled/all", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        ca.canceled_id,
        ca.order_item_id AS enquiryNo,
        ca.order_id,
        ca.user_id,
        ca.date_canceled,

        p.product_name AS service,
        oi.quantity,
        u.name AS customer_name,
        oi.estimated_price
      FROM canceled_orders ca
      JOIN orderitems oi ON ca.order_item_id = oi.order_item_id
      JOIN orders o ON ca.order_id = o.order_id
      JOIN users u ON ca.user_id = u.user_id
      JOIN products p ON oi.product_id = p.product_id
      ORDER BY ca.date_canceled DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("❌ Error loading canceled orders:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

module.exports = router;
