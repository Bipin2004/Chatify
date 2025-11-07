import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Square, Sparkles, Bot, X } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import WelcomeMessage from './WelcomeMessage';
import { useSocket } from '../../hooks/useSocket';
import { useAutoResize } from '../../hooks/useAutoResize';
import { useAuth } from '../../hooks/useAuth';

// New component for the attachment preview
const AttachmentPreview = ({ file, onRemove }) => {
  return (
    <div className="relative inline-block bg-slate-700/50 p-2 rounded-lg mb-2">
      <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-24 rounded" />
      <button 
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-slate-600 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};


export default function ChatBox() {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // State for the file
  const { user } = useAuth();
  const chatId = user?._id ? `user-${user._id}` : null; // User-specific chat room
  const { messages, sendMessage, typing } = useSocket(chatId);
  
  const endRef = useRef();
  const textareaRef = useAutoResize(input);
  const fileInputRef = useRef(null); // Ref for the hidden file input

  const send = (e) => {
    e.preventDefault();
    if (typing || (!input.trim() && !attachedFile)) return;
    
    // Convert image to base64 if attached
    if (attachedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        sendMessage({ 
          chatId, 
          senderId: user._id, 
          message: input || "What do you see in this image?", 
          imageData: base64Data 
        });
        setInput('');
        setAttachedFile(null);
      };
      reader.readAsDataURL(attachedFile);
    } else {
      // Send text-only message
      sendMessage({ chatId, senderId: user._id, message: input });
      setInput('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
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
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  // FIX: Added `textareaRef` to the dependency array to resolve the warning.
  }, [textareaRef]);

  // Don't render if user is not loaded yet
  if (!user || !chatId) {
    return (
      <div className="flex flex-col flex-1 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-900/50 backdrop-blur-sm min-h-0 chat-container">
      {/* Header (No changes) */}
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
            {/* <p className="text-sm text-slate-400">Powered by Gemini • Web Search Enabled</p> */}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 messages-area" 
        style={{ 
          scrollbarWidth: 'thin', 
          scrollbarColor: '#4B5563 transparent'
        }}
      >
        {messages.length === 0 && !typing ? (
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
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-lg shadow-lg z-10 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Attachment Preview */}
          {attachedFile && (
            <AttachmentPreview file={attachedFile} onRemove={() => setAttachedFile(null)} />
          )}
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
                  {/* Hidden file input */}
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*" // Accept images for now
                  />
                  <button
                    type="button"
                    // Trigger the hidden file input
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button type="button" className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white" title="Voice message">
                    <Mic size={18} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={typing || (!input.trim() && !attachedFile)}
                className={`
                  p-4 rounded-2xl transition-all duration-200 flex items-center justify-center relative overflow-hidden
                  ${typing || (!input.trim() && !attachedFile)
                    ? 'bg-slate-700/50 cursor-not-allowed' 
                    : 'btn-modern hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105'
                  }
                `}
              >
                {typing ? (
                  <div className="flex items-center space-x-2">
                    <Square size={20} className="text-white" />
                  </div>
                ) : (
                  <Send size={20} className="text-white" />
                )}
              </button>
            </div>
          </form>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 space-y-2 sm:space-y-0">
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
