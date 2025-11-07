// Migration script to update existing messages from 'global-chat' to user-specific chat IDs
require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/messageModel');
const connectDB = require('./config/db');

async function migrateChatIds() {
  try {
    await connectDB();
    
    console.log('🔍 Looking for messages with global-chat...');
    
    // Find all messages with global-chat
    const globalMessages = await Message.find({ chatId: 'global-chat' });
    console.log(`Found ${globalMessages.length} messages with global-chat ID`);
    
    if (globalMessages.length === 0) {
      console.log('✅ No migration needed - no global-chat messages found');
      process.exit(0);
    }
    
    // Group messages by sender (user)
    const messagesByUser = new Map();
    globalMessages.forEach(message => {
      if (message.sender) {
        const userId = message.sender.toString();
        if (!messagesByUser.has(userId)) {
          messagesByUser.set(userId, []);
        }
        messagesByUser.get(userId).push(message);
      }
    });
    
    console.log(`📊 Messages belong to ${messagesByUser.size} different users`);
    
    // Update messages for each user
    for (const [userId, userMessages] of messagesByUser.entries()) {
      const newChatId = `user-${userId}`;
      console.log(`🔄 Updating ${userMessages.length} messages for user ${userId} to chatId: ${newChatId}`);
      
      await Message.updateMany(
        { _id: { $in: userMessages.map(m => m._id) } },
        { $set: { chatId: newChatId } }
      );
    }
    
    // Delete any remaining global-chat messages without a sender (orphaned AI messages)
    const orphanedMessages = await Message.find({ chatId: 'global-chat', sender: null });
    if (orphanedMessages.length > 0) {
      console.log(`🗑️ Deleting ${orphanedMessages.length} orphaned AI messages`);
      await Message.deleteMany({ chatId: 'global-chat', sender: null });
    }
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

migrateChatIds();
