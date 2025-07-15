// frontend/src/hooks/useSocket.js
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { getToken } from './useAuth';

export const useSocket = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [typing, setTyping]     = useState(false);
  const socketRef               = useRef(null);

  // Fetch existing messages when chatId changes
  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const existingMessages = await response.json();
          setMessages(existingMessages);
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

    socket.on('connect', () => {
      socket.emit('join_room', chatId);
    });

    socket.on('room_joined', ({ room, socketId }) => {
      // Room joined successfully
    });

    socket.on('receive_message', msg => {
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const exists = prev.some(existingMsg => 
          existingMsg._id === msg._id || 
          (existingMsg.message === msg.message && 
           existingMsg.sender === msg.sender && 
           Math.abs(new Date(existingMsg.createdAt) - new Date(msg.createdAt)) < 1000)
        );
        
        if (exists) {
          return prev;
        }
        
        return [...prev, msg];
      });
      setTyping(false);
    });

    socket.on('chat_error', e => {
      console.warn('⚠️ chat_error:', e.message);
      alert(e.message);
    });

    socket.on('disconnect', () => {
      // Socket disconnected
    });

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
  };

  const indicateTyping = () => setTyping(true);

  return { messages, sendMessage, typing, indicateTyping };
};
