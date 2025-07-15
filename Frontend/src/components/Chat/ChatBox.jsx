import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Square, Sparkles, Bot, User } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';
import { useSocket } from '../../hooks/useSocket';
import { useAutoResize } from '../../hooks/useAutoResize';
import Loader from '../Common/Loader';
import { useAuth } from '../../hooks/useAuth';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const chatId = 'global-chat';
  const { messages, sendMessage, typing } = useSocket(chatId);
  const endRef = useRef();
  const textareaRef = useAutoResize(input);

  const send = (e) => {
    e.preventDefault();
    if (loading || !input.trim()) return;
    
    setLoading(true);
    sendMessage({ chatId, senderId: user._id, message: input });
    setInput('');
    setTimeout(() => setLoading(false), 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  useEffect(() => {
    // Improved scroll behavior for a smoother experience
    if (endRef.current) {
      const scrollContainer = endRef.current.parentElement;
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 200;
      
      // If user is already near bottom or it's a new message, scroll to bottom
      if (isNearBottom || messages[messages.length - 1]?.senderId === user?._id) {
        endRef.current.scrollIntoView({ 
          behavior: messages.length > 1 ? 'smooth' : 'auto',
          block: 'end'
        });
      }
    }
  }, [messages, typing, user?._id]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm relative">
      {/* Header */}
      <div className="hidden lg:flex items-center justify-between p-6 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-slate-400">Powered by Gemini • Web Search Enabled</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Online</span>
          </div>
          <div className="flex items-center space-x-1 px-3 py-1 bg-slate-800/50 rounded-full">
            <Bot size={14} className="text-purple-400" />
            <span className="text-xs text-slate-400">{messages.filter(m => m.isAI).length}</span>
          </div>
        </div>
      </div>

      {/* Messages Area - with bottom padding to account for fixed input */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-48 lg:pb-44" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}>
        {messages.length === 0 ? (
          <WelcomeMessage onSuggestionClick={handleSuggestionClick} />
        ) : (
          <>
            {messages.map((m, i) => {
              const senderId = typeof m.sender === 'object' && m.sender?._id ? m.sender._id : m.sender;
              const currentUserId = user?._id;
              const isFromCurrentUser = senderId?.toString() === currentUserId?.toString() && !m.isAI;
              
              return (
                <Message 
                  key={m._id || i} 
                  msg={m} 
                  self={isFromCurrentUser} 
                />
              );
            })}
            {typing && <TypingIndicator />}
          </>
        )}
        <div ref={endRef} className="h-1" />
      </div>

      {/* Fixed Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-lg shadow-lg z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={send} className="relative">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message AI Assistant..."
                  className="w-full px-4 py-4 pr-24 bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none overflow-hidden focus-ring"
                  rows="1"
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 top-3 flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                    title="Voice message"
                  >
                    <Mic size={18} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`
                  p-4 rounded-2xl transition-all duration-200 flex items-center justify-center relative overflow-hidden
                  ${loading || !input.trim() 
                    ? 'bg-slate-700/50 cursor-not-allowed' 
                    : 'btn-modern hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Square size={20} className="text-white" />
                  </div>
                ) : (
                  <Send size={20} className="text-white" />
                )}
              </button>
            </div>
          </form>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">
              <span className="inline-flex items-center space-x-1">
                <Sparkles size={12} />
                <span>AI can make mistakes. Consider checking important information.</span>
              </span>
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
