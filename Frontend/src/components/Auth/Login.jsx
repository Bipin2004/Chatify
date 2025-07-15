import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../Common/Loader';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-slate-400">Sign in to continue your AI conversation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {err && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm">{err}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-modern text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader size="sm" />
          ) : (
            <>
              <LogIn size={20} />
              <span className="font-medium">Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          Forgot your password?
        </a>
      </div>
    </div>
  );
}
