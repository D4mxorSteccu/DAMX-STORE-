import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const SearchPage: React.FC = () => {
  const { products, categories } = useApp();
  const [query, setQuery] = useState('');
  
  const trendingProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const recentSearches = ['software', 'netflix', 'office', 'gaming'];
  
  const results = query.trim() 
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories..."
              autoFocus
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl py-4 pl-14 pr-12 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </motion.div>
        
        {/* Results */}
        {query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products found</p>
                <p className="text-gray-600 text-sm">Try a different search term</p>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Default Content */}
        {!query.trim() && (
          <div className="space-y-8">
            {/* Recent Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                Popular Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-[#1a1a1a] border border-white/5 rounded-xl text-gray-400 hover:text-white hover:border-[#d4af37]/30 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-white font-semibold mb-4">Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/products?category=${category.slug}`}
                    className="p-4 bg-[#1a1a1a] border border-white/5 rounded-xl hover:border-[#d4af37]/30 transition-colors"
                  >
                    <p className="text-white font-medium">{category.name}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {products.filter(p => p.category === category.slug).length} products
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
            
            {/* Trending */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#d4af37]" />
                Trending Products
              </h2>
              <div className="space-y-3">
                {trendingProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center gap-4 p-3 bg-[#1a1a1a] border border-white/5 rounded-xl hover:border-[#d4af37]/30 transition-colors"
                  >
                    <span className="text-gray-600 font-bold w-6">{index + 1}</span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{product.name}</p>
                      <p className="text-gray-500 text-sm">{product.sold} sold</p>
                    </div>
                    <span className="text-[#d4af37] font-semibold">${product.price.toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
