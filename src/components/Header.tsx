import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, User, Package, Home, Search, LogOut, ChevronDown, Star, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { user, cartCount, logout, storeStats } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isLanding = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/auth';
  
  const navLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/my-items', label: 'My Items', icon: User },
    { to: '/support', label: 'Support', icon: MessageCircle },
  ];
  
  if (isLanding || isAdminRoute || isAuthRoute) return null;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center gap-3">
            <img src="https://files.catbox.moe/4wmspr.jpg" alt="DAMX STORE" className="w-10 h-10 rounded-lg object-cover" />
            <div className="hidden sm:block">
              <h1 className="text-white font-semibold text-lg tracking-wide">DAMX STORE</h1>
              <div className="flex items-center gap-1">
                <Star className="text-[#d4af37]" size={10} fill="currentColor" />
                <span className="text-[#d4af37] text-xs">{storeStats.averageRating.toFixed(1)} rating</span>
                <span className="text-gray-600 text-xs ml-1">• {storeStats.totalSold}+ sold</span>
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.to ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Link to="/search" className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </Link>
            
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </motion.span>
              )}
            </Link>
            
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                  <User size={16} className="text-[#d4af37]" />
                </div>
                <span className="hidden sm:block text-sm font-medium">{user?.username}</span>
                <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-white/5">
                      <p className="text-white font-medium">{user?.username}</p>
                      <p className="text-gray-500 text-xs">{user?.whatsapp}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#1a1a1a] border-t border-white/5">
            <div className="px-4 py-4 space-y-1">
              <div className="flex items-center gap-3 px-4 py-3 bg-[#0d0d0d] rounded-xl mb-3">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
                  <User size={18} className="text-[#d4af37]" />
                </div>
                <div>
                  <p className="text-white font-medium">{user?.username}</p>
                  <p className="text-gray-500 text-xs">{user?.whatsapp}</p>
                </div>
              </div>
              
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 w-full">
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
