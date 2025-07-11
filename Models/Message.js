const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
