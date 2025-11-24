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
const attributesRoutes = require("./routes/productAttributesRoutes");

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
app.use("/uploads/products", express.static(path.join(__dirname, "uploads/products")));



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
app.use("/api/attributes", attributesRoutes);


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
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("sendMessage", (msg) => {
    // already existing in your app
    io.to(msg.conversationId).emit("receiveMessage", msg);
  });

  // NEW: seen status
  socket.on("messageSeen", async ({ conversationId, messageId, seenBy }) => {

    io.to(conversationId).emit("messageSeen", {
      conversationId,
      messageId,
      seenBy,
    });
  });
});


// Start both Express + Socket.IO on same port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});
