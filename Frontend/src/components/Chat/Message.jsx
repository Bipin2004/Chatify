import React, { useState } from 'react';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check } from 'lucide-react';

export default function Message({ msg, self }) {
  const [copied, setCopied] = useState(false);
  const isUserMessage = self && !msg.isAI;
  const isAIMessage = msg.isAI;
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const renderMessageContent = (content) => {
    // Simple markdown-like formatting
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        return (
          <div key={index} className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-3 my-2 font-mono text-sm overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">Code</span>
              <button
                onClick={() => copyToClipboard(line.replace(/```\w*/, '').trim())}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Copy size={12} />
              </button>
            </div>
            <pre className="text-green-400 whitespace-pre-wrap">
              {line.replace(/```\w*/, '').trim()}
            </pre>
          </div>
        );
      }
      
      // Bold text
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        return (
          <div key={index} className="my-1">
            {parts.map((part, i) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
                : part
            )}
          </div>
        );
      }
      
      // Lists
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={index} className="flex items-start space-x-2 my-1">
            <span className="text-purple-400 mt-1">•</span>
            <span>{line.replace(/^[•\-]\s*/, '')}</span>
          </div>
        );
      }
      
      // Regular text
      return line.trim() ? <div key={index} className="my-1 leading-relaxed">{line}</div> : <br key={index} />;
    });
  };

  // ChatGPT-like layout: User messages on the right, AI messages full width
  if (isUserMessage) {
    return (
      <div className="message-bubble flex justify-end mb-6 group">
        <div className="flex items-end space-x-3 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
          {/* User Message Bubble - Compact like ChatGPT */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-lg shadow-blue-500/25">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </div>
            <div className="text-xs text-blue-100/70 mt-1">
              {formatTimestamp(msg.createdAt)}
            </div>
          </div>
          
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    );
  }

  // AI messages - full width like ChatGPT
  return (
    <div className="message-bubble flex justify-start mb-6 group">
      <div className="flex items-start space-x-4 max-w-full w-full">
        {/* AI Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
          <Bot size={16} className="text-white" />
        </div>

        {/* AI Message Content */}
        <div className="flex-1 min-w-0">
          {/* Message Bubble */}
          <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 text-white rounded-2xl rounded-tl-md p-4 hover:bg-slate-800/90 transition-all duration-200">
            {/* Message Content */}
            <div className="prose prose-sm max-w-none text-white">
              {renderMessageContent(msg.message)}
            </div>

            {/* Timestamp */}
            <div className="text-xs text-slate-400 mt-2">
              {formatTimestamp(msg.createdAt)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => copyToClipboard(msg.message)}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-all text-slate-400 hover:text-white flex items-center space-x-1"
              title="Copy message"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-all text-slate-400 hover:text-green-400"
              title="Good response"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-all text-slate-400 hover:text-red-400"
              title="Bad response"
            >
              <ThumbsDown size={14} />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-all text-slate-400 hover:text-purple-400"
              title="Regenerate response"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
