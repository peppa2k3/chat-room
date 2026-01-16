const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// MongoDB Connection   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/chat-app")
console.log(process.env.MONGODB_URI);
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://root:root@mongo:27017/chat-app?authSource=admin"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.io
const Message = require("./models/Message");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", async ({ roomId, userId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);

    socket.to(roomId).emit("user-joined", { username });
  });

  socket.on("send-message", async ({ roomId, userId, username, message }) => {
    try {
      const newMessage = new Message({
        room: roomId,
        user: userId,
        username,
        content: message,
      });
      await newMessage.save();

      io.to(roomId).emit("receive-message", {
        _id: newMessage._id,
        username,
        content: message,
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("leave-room", ({ roomId, username }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", { username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
