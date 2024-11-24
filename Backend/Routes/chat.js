const express = require('express');
const Chat = require('../models/Chat');
const router = express.Router();

// Fetch or create a chat for a buyer and seller
router.get('/:sellerId', async (req, res) => {
  const { sellerId } = req.params;
  const { buyerId } = req.query;

  try {
    let chat = await Chat.findOne({ buyerId, sellerId }).populate('messages.senderId', 'name');
    if (!chat) {
      chat = new Chat({ buyerId, sellerId, messages: [] });
      await chat.save();
    }
    res.status(200).json({ chatId: chat._id, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat for buyer.' });
  }
});

// Add a message to the chat (HTTP fallback for sending messages)
router.post('/message', async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found.' });

    const message = { senderId, text };
    chat.messages.push(message);
    await chat.save();

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: 'Error saving message.' });
  }
});

// Fetch all chats for a seller
router.get('/seller/:sellerId', async (req, res) => {
  const { sellerId } = req.params;

  try {
    const chats = await Chat.find({ sellerId })
      .populate('buyerId', 'name email')
      .populate('messages.senderId', 'name');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chats for seller.' });
  }
});

module.exports = router;
