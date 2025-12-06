// backend/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orderRoutes");
const supplyRoutes = require("./routes/supplyRoutes");
const salesRoutes = require("./routes/salesRoutes");
const chatRoutes = require("./routes/chatRoutes");
const backupRoutes = require("./routes/backupRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const otpRoutes = require("./routes/otpRoutes");
const attributesRoutes = require("./routes/productAttributesRoutes");
const designRoutes = require("./routes/designRoutes");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// ====== MIDDLEWARE ======
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files publicly
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "uploads/products"))
);

app.use(
  "/uploads/orderfiles",
  express.static(path.join(__dirname, "uploads/orderfiles"))
);

// ====== ROUTES ======
app.use("/api", userRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/supplies", supplyRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api", otpRoutes);
app.use("/api/attributes", attributesRoutes);
app.use("/api/designs", designRoutes);

// Attach io to req for routes that need it (orders)
app.use(
  "/api/orders",
  (req, res, next) => {
    req.io = io;
    next();
  },
  orderRoutes
);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ====== SOCKET.IO ======
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("joinUserRoom", (userId) => {
    if (!userId) return;
    const room = `user_${userId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined user room: ${room}`);
  });

  socket.on("sendMessage", (msg) => {
    io.to(msg.conversationId).emit("receiveMessage", msg);
  });

  socket.on("messageSeen", async ({ conversationId, messageId, seenBy }) => {
    io.to(conversationId).emit("messageSeen", {
      conversationId,
      messageId,
      seenBy,
    });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});