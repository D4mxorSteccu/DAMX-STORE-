import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Clock, Award, MessageCircle, Phone, Star, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const LandingPage: React.FC = () => {
  const { isLoggedIn, products, storeStats } = useApp();
  const navigate = useNavigate();
  
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  
  const handleEnterStore = () => {
    if (isLoggedIn) {
      navigate('/home');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#d4af37]/10 rounded-full blur-[120px] opacity-30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-full px-4 py-2 mb-6">
              <Star className="text-[#d4af37]" size={16} />
              <span className="text-[#d4af37] text-sm font-medium">Trusted Digital Marketplace</span>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-8">
            <img 
              src="https://files.catbox.moe/4wmspr.jpg" 
              alt="DAMX STORE" 
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl mx-auto shadow-2xl shadow-[#d4af37]/20 border-2 border-[#d4af37]/30"
            />
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            DAMX <span className="text-[#d4af37]">STORE</span>
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
            Premium digital products at unbeatable prices. Software licenses, courses, gaming keys, and more.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnterStore}
              className="group flex items-center gap-3 bg-[#d4af37] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-colors shadow-lg shadow-[#d4af37]/20"
            >
              Enter Store
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>
            
            <a
              href="https://t.me/D4mxorx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-[#d4af37] transition-colors px-6 py-4"
            >
              <MessageCircle size={20} />
              Contact Support
            </a>
          </motion.div>
          
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center justify-center gap-8 sm:gap-16">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{storeStats.totalSold}+</p>
              <p className="text-gray-500 text-sm">Products Sold</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{storeStats.totalCustomers}+</p>
              <p className="text-gray-500 text-sm">Happy Customers</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="text-[#d4af37]" size={20} fill="currentColor" />
                <p className="text-2xl sm:text-3xl font-bold text-white">{storeStats.averageRating.toFixed(1)}</p>
              </div>
              <p className="text-gray-500 text-sm">Rating</p>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-[#1a1a1a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Why Choose <span className="text-[#d4af37]">DAMX</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We deliver premium digital products with unmatched quality and service
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Secure Payment', desc: 'Your transactions are protected with enterprise-grade security' },
              { icon: Zap, title: 'Instant Delivery', desc: 'Get your products instantly or within 24 hours max' },
              { icon: Award, title: 'Quality Guaranteed', desc: 'All products are verified and come with warranty' },
              { icon: Clock, title: '24/7 Support', desc: 'Our team is always available to help you' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 hover:border-[#d4af37]/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                  <feature.icon className="text-[#d4af37]" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Featured Products
              </h2>
              <p className="text-gray-400">Top picks from our collection</p>
            </div>
            <button
              onClick={handleEnterStore}
              className="hidden sm:flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors"
            >
              View All <ArrowRight size={18} />
            </button>
          </motion.div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 bg-[#1a1a1a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Need Help?
            </h2>
            <p className="text-gray-400">Contact us anytime, we're here to help</p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://t.me/D4mxorx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1a1a1a] border border-white/10 px-6 py-4 rounded-xl hover:border-[#d4af37]/30 transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle className="text-[#d4af37]" size={24} />
              <div className="text-left">
                <p className="text-white font-medium">Telegram</p>
                <p className="text-gray-500 text-sm">@D4mxorx</p>
              </div>
            </a>
            
            <a
              href="https://wa.me/601130538675"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1a1a1a] border border-white/10 px-6 py-4 rounded-xl hover:border-[#d4af37]/30 transition-colors w-full sm:w-auto justify-center"
            >
              <Phone className="text-[#d4af37]" size={24} />
              <div className="text-left">
                <p className="text-white font-medium">WhatsApp</p>
                <p className="text-gray-500 text-sm">+60 11-3053 8675</p>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* Floating Admin Button */}
      <Link
        to="/admin"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-4 py-3 rounded-xl hover:border-[#d4af37]/30 transition-all group shadow-lg"
      >
        <Lock className="text-gray-500 group-hover:text-[#d4af37] transition-colors" size={18} />
        <span className="text-gray-500 group-hover:text-[#d4af37] text-sm font-medium transition-colors">Admin</span>
      </Link>
    </div>
  );
};

export default LandingPage;
