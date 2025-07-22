// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const { errors: celebrateErrors } = require('celebrate');
const promClient = require('prom-client');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const searchRoutes = require('./routes/searchRoutes');
const errorHandler = require('./utils/errorHandler');
const chatService = require('./services/chatService');
const { askGeminiStream } = require('./services/openaiService');

// --- Global Error Handlers ---
process.on('uncaughtException', err => console.error('Uncaught Exception:', err.stack || err));
process.on('unhandledRejection', reason => console.error(' Unhandled Rejection:', reason.stack || reason));

connectDB();

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimiter);
app.use(celebrateErrors());

// --- Metrics & Health ---
promClient.collectDefaultMetrics();
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
app.get('/health', (_req, res) => res.json({ status: 'OK', uptime: process.uptime() }));

// --- Serve Plugin Spec ---
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known')));

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/search', searchRoutes);

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Helper: turn a Mongoose document into a plain payload
function serializeMsg(doc) {
  return {
    _id: doc._id.toString(),
    chatId: doc.chatId,
    sender: doc.sender ? doc.sender.toString() : null,
    message: doc.message,
    isAI: doc.isAI,
    imageData: doc.imageData,
    hasImage: doc.hasImage,
    createdAt: doc.createdAt
  };
}

// --- Socket.IO Handlers ---
io.on('connection', socket => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 Socket connected:', socket.id);
  }

  socket.on('join_room', room => {
    socket.join(room);
    socket.emit('room_joined', { room, socketId: socket.id });
  });

  socket.on('send_message', async ({ chatId, senderId, message, imageData }) => {
    try {
      // --- CUSTOM THROTTLE REMOVED ---
      /*
      const MIN_INTERVAL = 30_000;
      const lastCall = new Map();
      const now = Date.now();
      const prev = lastCall.get(senderId) || 0;
      if (now - prev < MIN_INTERVAL) {
        const wait = Math.ceil((MIN_INTERVAL - (now - prev)) / 1000);
        return socket.emit('chat_error', {
          message: `Please wait ${wait}s before sending another message.`
        });
      }
      lastCall.set(senderId, now);
      */

      // Persist & emit user message with image data
      const messageData = { 
        chatId, 
        senderId, 
        message, 
        isAI: false,
        imageData: imageData || null,
        hasImage: !!imageData
      };
      const userDoc = await chatService.createMessage(messageData);
      io.to(chatId).emit('receive_message', serializeMsg(userDoc));

      // Prepare for streaming AI response
      io.to(chatId).emit('ai_typing', { isTyping: true });

      const history = await chatService.fetchMessages(chatId);
      const formattedHistory = history.map(msg => ({
        role: msg.isAI ? 'assistant' : 'user',
        content: msg.message,
        hasImage: msg.hasImage,
        imageData: msg.imageData
      }));

      // Call Gemini Stream
      const stream = await askGeminiStream(formattedHistory);

      let fullResponse = '';
      const tempAiId = new mongoose.Types.ObjectId().toString();
      
      socket.emit('stream_start', { _id: tempAiId, isAI: true, message: '' });

      for await (const chunk of stream) {
        const content = chunk.text();
        if (content) {
          fullResponse += content;
          socket.emit('stream_chunk', { _id: tempAiId, chunk: content });
        }
      }
      
      // Finalize
      io.to(chatId).emit('ai_typing', { isTyping: false });
      if (fullResponse) {
        const aiDoc = await chatService.createMessage({ chatId, senderId: null, message: fullResponse, isAI: true });
        socket.emit('stream_end', { tempId: tempAiId, finalMessage: serializeMsg(aiDoc) });
      }

    } catch (err) {
      console.error('❌ Error in send_message handler:', err.message, err.stack);
      socket.emit('chat_error', { message: 'Server error—please try again later.' });
      io.to(chatId).emit('ai_typing', { isTyping: false });
    }
  });

  socket.on('disconnect', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ Socket disconnected:', socket.id);
    }
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
