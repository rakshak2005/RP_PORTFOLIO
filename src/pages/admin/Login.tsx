import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

import { API_URL } from '../../config';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and navigate
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050208] text-white flex items-center justify-center relative overflow-hidden px-6">
      {/* Background glow animations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d946ef]/10 blur-[120px]" />
      <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] rounded-full bg-[#8b1ff5]/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo / Title */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-[#d946ef]/10 rounded-2xl border border-[#d946ef]/20 text-[#d946ef] mb-4">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">
            Admin <span className="text-[#d946ef]">Console</span>
          </h1>
          <p className="text-slate-500 text-xs tracking-widest uppercase mt-2">
            Secure Portfolio Authentication
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 shadow-[0_0_50px_rgba(217,70,239,0.05)]">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-xl border border-white/5 bg-black/40 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d946ef]/50 focus:bg-[#d946ef]/5 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-xl border border-white/5 bg-black/40 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d946ef]/50 focus:bg-[#d946ef]/5 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative py-4 overflow-hidden rounded-xl bg-white text-black font-black uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#d946ef] hover:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Authenticating...' : 'Secure Access'} 
                {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-500 hover:text-white text-xs font-mono transition-colors uppercase tracking-wider"
          >
            ← Back to Portfolio
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
