import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Routes>
        <Route path="/" element={ user ? <Navigate to="/chat"/> : <HomePage/> }/>
        <Route path="/chat" element={ user ? <ChatPage/> : <Navigate to="/"/> }/>
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
  );
}
