const express = require("express");
const router = express.Router();
const Message = require("../Models/Message"); // adjust if needed

// POST: Save a message to DB
router.post("/", async (req, res) => {
  try {
    const { bookingId, senderId, receiverId, senderName, content } = req.body;

    const message = new Message({
      bookingId,
      senderId,
      receiverId,
      senderName,
      content,
      createdAt: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error("POST /messages error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET: Fetch messages by bookingId, sorted by time
router.get("/:bookingId", async (req, res) => {
  try {
    const messages = await Message.find({ bookingId: req.params.bookingId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("GET /messages/:bookingId error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
