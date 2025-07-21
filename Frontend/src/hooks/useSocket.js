// frontend/src/hooks/useSocket.js
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { getToken } from './useAuth'; // Assuming useAuth provides getToken

export const useSocket = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);

  // Fetch existing messages when chatId changes
  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          setMessages(await response.json());
        } else {
          console.warn('Failed to fetch existing messages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const socket = io('http://localhost:5000', {
      auth: { token: getToken() },
      transports: ['websocket']
    });
    socketRef.current = socket;

    socket.on('connect', () => socket.emit('join_room', chatId));
    socket.on('room_joined', () => {});

    // Handles regular user messages
    socket.on('receive_message', msg => {
      setMessages(prev => [...prev, msg]);
    });

    // Handles AI typing indicator
    socket.on('ai_typing', ({ isTyping }) => {
        setTyping(isTyping);
    });

    // --- STREAMING HANDLERS ---
    socket.on('stream_start', (initialAiMessage) => {
      setTyping(false); // Stop showing "Bot is typing..."
      setMessages(prev => [...prev, { ...initialAiMessage, isStreaming: true }]);
    });

    socket.on('stream_chunk', ({ _id, chunk }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === _id ? { ...msg, message: msg.message + chunk } : msg
        )
      );
    });

    socket.on('stream_end', ({ tempId, finalMessage }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === tempId ? { ...finalMessage, isStreaming: false } : msg
        )
      );
    });

    socket.on('chat_error', e => {
      console.warn('⚠️ chat_error:', e.message);
      alert(e.message);
      setTyping(false);
    });

    socket.on('disconnect', () => {});

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId]);

  const sendMessage = (msg) => {
    if (!socketRef.current) {
      console.error('Socket not connected yet');
      return;
    }
    socketRef.current.emit('send_message', msg);
    setTyping(true); // Optimistically show typing indicator
  };

  return { messages, sendMessage, typing };
};
