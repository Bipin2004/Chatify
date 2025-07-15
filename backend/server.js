// backend/server.js
require('dotenv').config();
const express       = require('express');
const path          = require('path');
const http          = require('http');
const helmet        = require('helmet');
const compression   = require('compression');
const cors          = require('cors');
const rateLimiter   = require('./middleware/rateLimiter');
const { errors: celebrateErrors } = require('celebrate');
const promClient    = require('prom-client');
const { Server }    = require('socket.io');

const connectDB     = require('./config/db');
const userRoutes    = require('./routes/userRoutes');
const chatRoutes    = require('./routes/chatRoutes');
const searchRoutes  = require('./routes/searchRoutes');
const errorHandler  = require('./utils/errorHandler');
const chatService   = require('./services/chatService');
const { askGemini } = require('./services/openaiService');

// ─── Global Error Handlers ────────────────────────────────
process.on('uncaughtException', err =>
  console.error('🔴 Uncaught Exception:', err.stack || err)
);
process.on('unhandledRejection', reason =>
  console.error('🔴 Unhandled Rejection:', reason.stack || reason)
);

// ─── Connect to MongoDB ───────────────────────────────────
connectDB();

// ─── Express App Setup ────────────────────────────────────
const app = express();
app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(rateLimiter);
app.use(celebrateErrors());

// ─── Metrics & Health ─────────────────────────────────────
promClient.collectDefaultMetrics();
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
app.get('/health', (_req, res) => res.json({ status: 'OK', uptime: process.uptime() }));

// ─── Serve Plugin Spec ────────────────────────────────────
app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known')));

// ─── API Routes ───────────────────────────────────────────
app.use('/api/users',  userRoutes);
app.use('/api/chats',  chatRoutes);
app.use('/api/search', searchRoutes);

// ─── Express Error Handler ────────────────────────────────
app.use(errorHandler);

// ─── HTTP & Socket.IO Setup ───────────────────────────────
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { origin: '*' },
  auth: false // Disable auth for now to test
});

// ─── Per-user Throttle ────────────────────────────────────
const MIN_INTERVAL = 30_000;    // 30 seconds
const lastCall     = new Map(); // senderId → timestamp

// Helper: turn a Mongoose document into a plain payload
function serializeMsg(doc) {
  return {
    _id:       doc._id.toString(),
    chatId:    doc.chatId,
    sender:    doc.sender ? doc.sender.toString() : null,
    message:   doc.message,
    isAI:      doc.isAI,
    createdAt: doc.createdAt
  };
}

// ─── Socket.IO Handlers ───────────────────────────────────
io.on('connection', socket => {
  // Only log connection in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 Socket connected:', socket.id);
  }

  socket.on('join_room', room => {
    socket.join(room);
    socket.emit('room_joined', { room, socketId: socket.id });
  });

  socket.on('send_message', async ({ chatId, senderId, message }) => {
    try {
      // 1) Throttle
      const now  = Date.now();
      const prev = lastCall.get(senderId) || 0;
      if (now - prev < MIN_INTERVAL) {
        const wait = Math.ceil((MIN_INTERVAL - (now - prev)) / 1000);
        return socket.emit('chat_error', {
          message: `Please wait ${wait}s before sending another message.`
        });
      }
      lastCall.set(senderId, now);

      // 2) Persist & emit user message
      const userDoc = await chatService.createMessage({
        chatId, senderId, message, isAI: false
      });
      const userPayload = serializeMsg(userDoc);
      io.to(chatId).emit('receive_message', userPayload);

      // 3) Call Gemini
      const aiText = await askGemini(message);

      // 4) Persist & emit AI message
      const aiDoc = await chatService.createMessage({
        chatId, senderId: null, message: aiText, isAI: true
      });
      const aiPayload = serializeMsg(aiDoc);
      io.to(chatId).emit('receive_message', aiPayload);

    } catch (err) {
      console.error('❌ Error in send_message handler:', err.message);
      console.error(err.stack);
      socket.emit('chat_error', {
        message: 'Server error—please try again later.'
      });
    }
  });

  socket.on('disconnect', () => {
    // Only log disconnection in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ Socket disconnected:', socket.id);
    }
  });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
