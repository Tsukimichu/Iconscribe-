require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

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

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Serve uploaded files publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Routes
app.use("/api", userRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/supplies", supplyRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api", otpRoutes);

// Attach io to req for routes that need it
app.use("/api/orders", (req, res, next) => {
  req.io = io;
  next();
}, orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a room (e.g., for chat)
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Join personal room for order notifications
  socket.on("joinUserRoom", (userId) => {
    socket.join(userId.toString());
    console.log(`User joined personal room: ${userId}`);
  });

  // Chat messages
  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.to(data.conversationId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start both Express + Socket.IO on same port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});
