import React from 'react';
import { Sparkles, MessageSquare, Search, Zap, Code, Lightbulb, Globe } from 'lucide-react';

export default function WelcomeMessage({ onSuggestionClick }) {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Conversation",
      description: "Chat naturally with advanced AI"
    },
    {
      icon: Search,
      title: "Web Search",
      description: "Get real-time information from the web"
    },
    {
      icon: Code,
      title: "Code Assistant",
      description: "Help with programming and debugging"
    },
    {
      icon: Lightbulb,
      title: "Creative Ideas",
      description: "Brainstorm and solve problems"
    }
  ];

  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "What are the latest AI developments?",
    "Help me plan a web application",
    "Create a responsive CSS layout",
    "Explain React hooks with examples"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn p-8">
      {/* Main Logo */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
          <Sparkles size={48} className="text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 animate-pulse"></div>
      </div>

      {/* Welcome Text */}
      <div className="mb-8 max-w-2xl">
        <h3 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="gradient-text">AI Chat</span>
        </h3>
        <p className="text-xl text-slate-300 leading-relaxed">
          Your intelligent assistant powered by Gemini. Ask questions, get help with code, 
          research topics, or just have a conversation. I'm here to help!
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-700/40 transition-all duration-200 hover-lift"
          >
            <feature.icon size={24} className="text-purple-400 mx-auto mb-2" />
            <h4 className="text-white font-semibold text-sm mb-1">{feature.title}</h4>
            <p className="text-slate-400 text-xs">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Suggestion Cards */}
      <div className="w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-white mb-4">Try asking me about:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="group p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-xl text-left transition-all duration-200 border border-slate-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover-lift"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors">
                  <Sparkles size={16} className="text-purple-400" />
                </div>
                <p className="text-white group-hover:text-purple-300 transition-colors text-sm leading-relaxed">
                  {suggestion}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Online & Ready</span>
        </div>
        <div className="flex items-center space-x-2">
          <Globe size={16} className="text-purple-400" />
          <span>Web Search Enabled</span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap size={16} className="text-yellow-400" />
          <span>Fast Response</span>
        </div>
      </div>
    </div>
  );
}
