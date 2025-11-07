import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Common/Sidebar';
import ChatBox from '../components/Chat/ChatBox';
import Loader from '../components/Common/Loader';

export default function ChatPage() {
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex min-h-screen h-full">
        {/* Sidebar is included here */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0 min-h-screen">
          {/* Mobile Header with menu button */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <Menu size={20} className="text-slate-400" />
            </button>
            <h1 className="text-xl font-bold gradient-text">AI Chat</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Chat Area */}
          {!ready ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader />
            </div>
          ) : (
            <ChatBox />
          )}
        </div>
      </div>
    </div>
  );
}
