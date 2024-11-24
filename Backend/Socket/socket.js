const { Server } = require('socket.io');
const Chat = require('../models/Chat');

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a specific chat room
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    // Handle real-time message sending
    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat) {
          const message = { senderId, text };
          chat.messages.push(message);
          await chat.save();

          // Broadcast the message to the chat room
          io.to(chatId).emit('messageReceived', message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
