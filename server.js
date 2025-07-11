const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Models
const Message = require('./Models/Message');

// Database connection
require('./Models/db'); // Assumes db.js connects using mongoose.connect()

// Express app and HTTP server
const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  "https://resideease-hkuphuxty-vanshika-guptas-projects-f78d71c3.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(bodyParser.json());

// Routes
app.use('/auth', require('./routes/AuthRouter'));
app.use('/user', require('./routes/User'));
app.use('/accommodations', require('./routes/AccomodationRoutes'));
app.use('/booking', require('./routes/BookingRoutes'));
app.use('/fetch', require('./routes/Fetch'));
app.use('/remove', require('./routes/Remove'));
app.use('/add', require('./routes/Add'));
app.use('/messages', require('./routes/messages')); // ✅ Message route

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('✅ User connected');

  // Join room by booking ID
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`🟢 Joined room: ${roomId}`);
  });

  // ✅ Send message
  socket.on('send_message', async (data) => {
    try {
      const newMessage = new Message({
        bookingId: data.bookingId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        senderName: data.senderName,
        content: data.content,
        createdAt: new Date()
      });

      await newMessage.save();

      // 🔁 Emit to all users in room (customer & admin)
      io.to(data.bookingId).emit('receive_message', newMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  // Optional: typing indicator
  socket.on('typing', ({ roomId, username, isTyping }) => {
    socket.to(roomId).emit('user_typing', { username, isTyping });
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
    io.emit('user_list_updated', onlineUsers);
    console.log('❌ User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
