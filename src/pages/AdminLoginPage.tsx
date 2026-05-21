import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, AlertCircle, X, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdmin } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (adminLogin(password)) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid password. Please try again.');
    }
    setLoading(false);
  };
  
  const goBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back to Store</span>
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden relative">
          {/* Close Button */}
          <button
            onClick={goBack}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          {/* Header */}
          <div className="p-6 border-b border-white/5 text-center pt-12">
            <div className="w-16 h-16 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-[#d4af37]" size={32} />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your password to continue</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4"
              >
                <AlertCircle className="text-red-400" size={18} />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
            
            <div className="relative mb-6">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
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
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!password || loading}
              className={"w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 " + (password && !loading ? "bg-[#d4af37] text-black hover:bg-white" : "bg-gray-700 text-gray-500 cursor-not-allowed")}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </motion.button>
          </form>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-4">
          This area is restricted. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
