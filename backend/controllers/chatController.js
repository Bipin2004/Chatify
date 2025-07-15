const chatService = require('../services/chatService');

// GET /api/chats/:chatId/messages
exports.getMessages = async (req, res, next) => {
  try {
    const msgs = await chatService.fetchMessages(req.params.chatId);
    res.json(msgs);
  } catch (err) {
    next(err);
  }
};

// POST /api/chats/:chatId/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const { chatId } = req.params;

    // persist and return user message
    const userMsg = await chatService.createMessage({
      chatId, senderId, message, isAI: false
    });
    res.status(201).json(userMsg);
    // AI response and real-time emit handled in socket.io handler
  } catch (err) {
    next(err);
  }
};
