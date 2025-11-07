const chatService = require('../services/chatService');

// GET /api/chats/:chatId/messages
exports.getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id.toString();
    
    // Validate that user can only access their own chat
    const expectedChatId = `user-${userId}`;
    if (chatId !== expectedChatId) {
      return res.status(403).json({ message: 'Access denied: Cannot access other user\'s chat' });
    }
    
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
    const senderId = req.user._id.toString();
    const { chatId } = req.params;
    
    // Validate that user can only send messages to their own chat
    const expectedChatId = `user-${senderId}`;
    if (chatId !== expectedChatId) {
      return res.status(403).json({ message: 'Access denied: Cannot send message to other user\'s chat' });
    }

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
