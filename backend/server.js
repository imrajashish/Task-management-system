require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { encryptResponse, decryptRequest } = require("./middleware/encryption");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Socket.io setup
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(decryptRequest); // Decrypt incoming requests

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);

// Encryption middleware for all responses
app.use(encryptResponse);

// Socket.io logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  socket.on("joinRoom", ({ userId }) => {
    socket.join(userId);
    console.log(`📥 User ${userId} joined their room`);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    io.to(receiverId).emit("receiveMessage", { senderId, message });
    console.log(`📤 Message from ${senderId} to ${receiverId}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
