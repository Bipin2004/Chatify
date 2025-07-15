import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 z-10">
      <Link to="/" className="text-xl font-bold">AI Chat</Link>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Hi, {user.name}</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
