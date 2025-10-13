const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orderRoutes");
const supplyRoutes = require("./routes/supplyRoutes");
const salesRoutes = require("./routes/salesRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", userRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/supplies", supplyRoutes);
app.use("/api/sales", salesRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
