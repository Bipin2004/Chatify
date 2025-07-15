const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId:  { type: String, required: true },
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  isAI:    { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
