const Message = require('../models/messageModel');

exports.fetchMessages = async (chatId) => {
  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .populate('sender', 'name');
  
  // Transform to match the same structure as real-time messages
  return messages.map(msg => ({
    _id: msg._id.toString(),
    chatId: msg.chatId,
    sender: msg.sender ? msg.sender._id.toString() : null,
    message: msg.message,
    isAI: msg.isAI,
    createdAt: msg.createdAt
  }));
};

exports.createMessage = async ({ chatId, senderId, message, isAI }) => {
  return Message.create({ chatId, sender: senderId, message, isAI });
};
