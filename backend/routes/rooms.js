// routes/rooms.js
const express = require("express");
const Room = require("../models/Room");
const Message = require("../models/Message");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const room = new Room({
      name,
      description,
      owner: req.userId,
      ownerName: req.user.username,
      members: [req.userId],
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:roomId/messages", auth, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/:roomId/join", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
