import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  User, 
  LogOut,
  X,
  Search,
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // CHANGE: The mock chat history array is now an empty array.
  // This will be replaced with your actual data from an API later.
  const chatHistory = [];

  const filteredHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full min-h-screen w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50
        transform transition-transform duration-300 z-50 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold gradient-text">AI Chat</h1>
              <button
                onClick={onToggle}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            {/* New Chat Button */}
            <button className="w-full btn-modern text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg">
              <Plus size={20} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* CHANGE: This now checks if filteredHistory has items. */}
              {/* If not, it displays a placeholder message. */}
              {filteredHistory.length > 0 ? (
                filteredHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start space-x-3">
                      <MessageSquare size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                          {chat.title}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock size={12} className="text-slate-500" />
                          <span className="text-xs text-slate-500">{chat.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm">No recent chats</p>
                </div>
              )}
            </div>
          </div>

          {/* User Profile & Settings */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400">Free Plan</p>
                </div>
              </div>
              
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-300 hover:text-white">
                <Settings size={16} />
                <span className="text-sm">Settings</span>
              </button>
              
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors text-slate-300 hover:text-red-400"
              >
                <LogOut size={16} />
                <span className="text-sm">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
