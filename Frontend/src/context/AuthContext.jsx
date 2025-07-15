import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('chatUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/users/login', { email, password });
    setUser(data);
    localStorage.setItem('chatUser', JSON.stringify(data));
    nav('/chat');
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/users/register', { name, email, password });
    setUser(data);
    localStorage.setItem('chatUser', JSON.stringify(data));
    nav('/chat');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chatUser');
    nav('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
