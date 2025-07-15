import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 mb-4 animate-fadeIn">
      {/* AI Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-white" />
      </div>

      {/* Typing Bubble */}
      <div className="ml-3">
        <div className="bg-slate-800/50 border border-slate-700/50 px-4 py-3 rounded-2xl">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot"></div>
            </div>
            <span className="text-slate-300 text-sm">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
