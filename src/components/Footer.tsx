import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Phone, Mail, Shield, Clock, Award } from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) return null;
  
  return (
    <footer className={`${isLanding ? '' : 'mt-24'} bg-[#0d0d0d] border-t border-white/5`}>
      {/* Trust Indicators */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                <Shield className="text-[#d4af37]" size={20} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Secure Payment</p>
                <p className="text-gray-500 text-xs">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                <Clock className="text-[#d4af37]" size={20} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Fast Delivery</p>
                <p className="text-gray-500 text-xs">Instant to 24h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                <Award className="text-[#d4af37]" size={20} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Trusted Seller</p>
                <p className="text-gray-500 text-xs">Verified Business</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center">
                <MessageCircle className="text-[#d4af37]" size={20} />
              </div>
              <div>
                <p className="text-white text-sm font-medium">24/7 Support</p>
                <p className="text-gray-500 text-xs">Always Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://files.catbox.moe/4wmspr.jpg" 
                alt="DAMX STORE" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-white font-semibold text-lg">DAMX STORE</h3>
                <p className="text-[#d4af37] text-sm">Trusted Digital Marketplace</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Your trusted source for premium digital products. We offer software licenses, 
              e-books, courses, gaming keys, and more. All products come with warranty and instant delivery.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=software" className="text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                  Software
                </Link>
              </li>
              <li>
                <Link to="/products?category=courses" className="text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/products?category=gaming" className="text-gray-400 hover:text-[#d4af37] text-sm transition-colors">
                  Gaming
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="https://t.me/D4mxorx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#d4af37] text-sm transition-colors"
              >
                <MessageCircle size={16} />
                @D4mxorx
              </a>
              <a
                href="https://wa.me/601130538675"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#d4af37] text-sm transition-colors"
              >
                <Phone size={16} />
                +60 11-3053 8675
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} DAMX STORE. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/admin" className="text-gray-600 hover:text-[#d4af37] text-xs transition-colors">
                Admin Login
              </Link>
              <span className="text-gray-700">|</span>
              <p className="text-gray-600 text-xs">
                D4MXOR - Trusted Digital Marketplace
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
