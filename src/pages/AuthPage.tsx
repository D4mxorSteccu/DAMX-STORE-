import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Phone, ArrowRight, UserPlus, LogIn, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AuthPage: React.FC = () => {
  const { login, register, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home', { replace: true });
    }
  }, [isLoggedIn, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mode === 'register') {
      if (!username.trim() || !password.trim() || !whatsapp.trim()) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        setLoading(false);
        return;
      }
      
      const result = await register(username.trim(), password, whatsapp.trim());
      if (result.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1000);
      } else {
        setError(result.message);
      }
    } else {
      if (!username.trim() || !password.trim()) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      const result = await login(username.trim(), password);
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 500);
      } else {
        setError(result.message);
      }
    }
    
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img 
            src="https://files.catbox.moe/4wmspr.jpg" 
            alt="DAMX STORE" 
            className="w-20 h-20 rounded-2xl mx-auto mb-4 shadow-lg shadow-[#d4af37]/20"
          />
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            DAMX <span className="text-[#d4af37]">STORE</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Trusted Digital Marketplace</p>
        </motion.div>
        
        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={"flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 " + (mode === 'login' ? "text-[#d4af37] border-b-2 border-[#d4af37] bg-[#d4af37]/5" : "text-gray-500 hover:text-white")}
            >
              <LogIn size={18} />
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={"flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 " + (mode === 'register' ? "text-[#d4af37] border-b-2 border-[#d4af37] bg-[#d4af37]/5" : "text-gray-500 hover:text-white")}
            >
              <UserPlus size={18} />
              Register
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4"
                >
                  <AlertCircle className="text-red-400" size={18} />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
              
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4"
                >
                  <CheckCircle className="text-green-400" size={18} />
                  <p className="text-green-400 text-sm">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 transition-colors"
                  />
                </div>
              </div>
              
              {/* Password */}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* WhatsApp (Register only) */}
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-gray-400 text-sm mb-1 block">WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g., +60123456789"
                      className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 transition-colors"
                    />
                  </div>
                  <p className="text-gray-600 text-xs mt-1">For order notifications and support</p>
                </motion.div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-[#d4af37] text-black py-3 rounded-xl font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Login' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
          
          {/* Switch Mode */}
          <div className="px-6 pb-6 text-center">
            <p className="text-gray-500 text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
                className="text-[#d4af37] hover:text-white transition-colors font-medium"
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
        
        {/* Admin Link - Fixed */}
        <div className="text-center mt-6">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#d4af37] transition-colors text-sm"
          >
            <Lock size={14} />
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
