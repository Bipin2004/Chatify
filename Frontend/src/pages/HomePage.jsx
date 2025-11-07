import React, { useState } from 'react';
import { Sparkles, MessageSquare, Search, Zap, Shield, Users } from 'lucide-react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

export default function HomePage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Background Pattern - Applied to entire page */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AI Chat</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch min-h-[600px]">
            {/* Left Side - Hero Content */}
            <div className="space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Chat with
                  <span className="gradient-text"> AI</span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Experience the future of conversation with our AI assistant. 
                  Get instant answers, research help, and creative assistance.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <MessageSquare size={24} className="text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">Smart Chat</h3>
                    <p className="text-slate-400 text-sm">Natural conversations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <Search size={24} className="text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">Web Search</h3>
                    <p className="text-slate-400 text-sm">Real-time information</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <Zap size={24} className="text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">Fast Response</h3>
                    <p className="text-slate-400 text-sm">Instant answers</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {/* <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">1M+</div>
                  <div className="text-slate-400">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50k+</div>
                  <div className="text-slate-400">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-slate-400">Uptime</div>
                </div>
              </div> */}
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                  {showRegister ? <Register /> : <Login />}
                  
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowRegister(!showRegister)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {showRegister
                        ? 'Already have an account? Log in'
                        : "Don't have an account? Register"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-white mb-4">Why Choose Our AI Assistant?</h3>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Experience the next generation of AI-powered conversations with advanced features and seamless integration.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">Secure & Private</h4>
                <p className="text-slate-400">Your conversations are encrypted and never stored permanently. Complete privacy guaranteed.</p>
              </div>

              <div className="text-center p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">Lightning Fast</h4>
                <p className="text-slate-400">Get instant responses powered by the latest AI technology and optimized infrastructure.</p>
              </div>

              <div className="text-center p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-4">Always Available</h4>
                <p className="text-slate-400">24/7 availability with real-time responses. Your AI assistant is always ready to help.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
