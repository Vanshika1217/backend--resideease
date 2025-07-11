const express = require("express");
const router = express.Router();
const Message = require("../Models/Message"); // ✅ Ensure correct path

// ✅ POST: Save a message
router.post("/", async (req, res) => {
  try {
    const { bookingId, senderId, receiverId, senderName, content } = req.body;

    // ✅ Log all incoming fields
    console.log("📩 Incoming message body:", req.body);
    console.log("🧾 bookingId:", bookingId);
    console.log("🧾 senderId:", senderId);
    console.log("🧾 receiverId:", receiverId);
    console.log("🧾 senderName:", senderName);
    console.log("🧾 content:", content);

    // ✅ Check for missing fields
    if (!bookingId || !senderId || !receiverId || !senderName || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
    console.error("❌ POST /messages error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET: Fetch messages by bookingId
router.get("/:bookingId", async (req, res) => {
  try {
    const messages = await Message.find({ bookingId: req.params.bookingId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ GET /messages/:bookingId error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
