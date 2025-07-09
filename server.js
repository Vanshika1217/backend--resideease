const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./Models/Message');

const AuthRouter = require('./routes/AuthRouter');
const AccomodationRoutes = require('./routes/AccomodationRoutes');
const FetchRoutes = require('./routes/Fetch');
const RemoveRoutes = require('./routes/Remove');
const AddRoutes = require('./routes/Add');
const UserRoutes = require('./routes/User');
const BookingRoutes = require('./routes/BookingRoutes');
const ChatRoutes = require('./routes/ChatRoutes');

dotenv.config();
require('./Models/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', AuthRouter);
app.use('/accommodations', AccomodationRoutes);
app.use('/fetch', FetchRoutes);
app.use('/remove', RemoveRoutes);
app.use('/add', AddRoutes);
app.use('/user', UserRoutes);
app.use('/booking', BookingRoutes);
app.use('/chat', ChatRoutes);

// Socket.IO Logic
let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('register_user', ({ username, userId }) => {
    socket.username = username;
    socket.userId = userId;

    if (!onlineUsers.some(u => u.userId === userId)) {
      onlineUsers.push({ userId, username, socketId: socket.id });
    }

    io.emit('user_list_updated', onlineUsers);
  });

  socket.on('send_message', async (data) => {
    try {
      const savedMsg = new Message(data);
      await savedMsg.save();

      // Emit to everyone including sender
      io.emit('receive_message', savedMsg);

      // Emit back to sender with delivery status
      socket.emit('message_delivered', {
        ...savedMsg.toObject(),
        status: 'delivered',
      });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on('mark_as_read', async (messageId) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      if (!message.readBy.includes(socket.userId)) {
        message.readBy.push(socket.userId);
        if (message.userId === socket.userId) {
          message.status = 'read';
        }
        await message.save();

        io.emit('message_read', {
          messageId: message._id,
          userId: socket.userId
        });
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  });

  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('user_typing', {
      username: socket.username,
      isTyping,
    });
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user.userId !== socket.userId);
    io.emit('user_list_updated', onlineUsers);
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
