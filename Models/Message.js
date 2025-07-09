const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: String,
  userId: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readBy: [String],
  status: {
    type: String,
    enum: ['sending', 'delivered', 'read'],
    default: 'sending',
  },
  tempId: String,
});

module.exports = mongoose.model('Message', messageSchema);
