import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
export const useAuth = () => useContext(AuthContext);
export const getToken = () => {
  const stored = localStorage.getItem('chatUser');
  return stored ? JSON.parse(stored).token : null;
};
