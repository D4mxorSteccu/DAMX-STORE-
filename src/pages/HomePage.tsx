import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, TrendingUp, Star, Zap, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
  const { products, categories, activeAnnouncements } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  const featuredProducts = products.filter(p => p.featured);
  const trendingProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const recentProducts = [...products].slice(-4).reverse();
  
  const filteredProducts = searchQuery
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Announcements */}
        {activeAnnouncements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {activeAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                className={`p-4 rounded-xl border mb-2 ${
                  announcement.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  announcement.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
                  'bg-[#d4af37]/10 border-[#d4af37]/20'
                }`}
              >
                <p className={`text-sm font-medium ${
                  announcement.type === 'warning' ? 'text-yellow-400' :
                  announcement.type === 'success' ? 'text-green-400' :
                  'text-[#d4af37]'
                }`}>
                  {announcement.message}
                </p>
              </div>
            ))}
          </motion.div>
        )}
        
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 transition-colors"
            />
          </div>
        </motion.div>
        
        {/* Search Results */}
        {filteredProducts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Search Results ({filteredProducts.length})
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No products found</p>
            )}
          </motion.div>
        )}
        
        {!filteredProducts && (
          <>
            {/* Categories */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Categories</h2>
                <Link to="/products" className="text-[#d4af37] text-sm hover:text-white transition-colors flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 hover:border-[#d4af37]/20 transition-all group-hover:shadow-lg group-hover:shadow-[#d4af37]/5"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center mb-3 group-hover:bg-[#d4af37]/20 transition-colors">
                        <Package className="text-[#d4af37]" size={24} />
                      </div>
                      <p className="text-white text-sm font-medium">{category.name}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {products.filter(p => p.category === category.slug).length} products
                      </p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.section>
            
            {/* Featured Products */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="text-[#d4af37]" size={20} />
                  <h2 className="text-xl font-semibold text-white">Featured Products</h2>
                </div>
                <Link to="/products?featured=true" className="text-[#d4af37] text-sm hover:text-white transition-colors flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </motion.section>
            
            {/* Trending Products */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-[#d4af37]" size={20} />
                  <h2 className="text-xl font-semibold text-white">Trending Now</h2>
                </div>
                <Link to="/products?sort=trending" className="text-[#d4af37] text-sm hover:text-white transition-colors flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </motion.section>
            
            {/* New Arrivals */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="text-[#d4af37]" size={20} />
                  <h2 className="text-xl font-semibold text-white">New Arrivals</h2>
                </div>
                <Link to="/products?sort=new" className="text-[#d4af37] text-sm hover:text-white transition-colors flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
