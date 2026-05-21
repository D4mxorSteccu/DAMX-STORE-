import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Grid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const { products, categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || '';
  
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'trending':
        result.sort((a, b) => b.sold - a.sold);
        break;
      case 'new':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);
  
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };
  
  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort) {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    setSearchParams(params);
  };
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {selectedCategory 
              ? categories.find(c => c.slug === selectedCategory)?.name || 'Products'
              : 'All Products'
            }
          </h1>
          <p className="text-gray-400">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>
        
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 transition-colors"
              />
            </div>
            
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 bg-[#1a1a1a] border border-white/5 rounded-xl py-3 px-4 text-white"
            >
              <Filter size={18} />
              Filters
            </button>
            
            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="appearance-none bg-[#1a1a1a] border border-white/5 rounded-xl py-3 pl-4 pr-10 text-white focus:outline-none focus:border-[#d4af37]/30 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
              </div>
              
              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-[#1a1a1a] border border-white/5 rounded-xl py-3 pl-4 pr-10 text-white focus:outline-none focus:border-[#d4af37]/30 cursor-pointer"
                >
                  <option value="">Sort By</option>
                  <option value="trending">Best Selling</option>
                  <option value="new">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
              </div>
              
              {/* View Mode */}
              <div className="flex items-center bg-[#1a1a1a] border border-white/5 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-500 hover:text-white'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-gray-500 hover:text-white'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="lg:hidden mt-4 space-y-3"
            >
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#d4af37]/30"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#d4af37]/30"
              >
                <option value="">Sort By</option>
                <option value="trending">Best Selling</option>
                <option value="new">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </motion.div>
          )}
        </motion.div>
        
        {/* Active Filters */}
        {(selectedCategory || sortBy) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {selectedCategory && (
              <span className="flex items-center gap-2 bg-[#d4af37]/10 text-[#d4af37] px-3 py-1.5 rounded-lg text-sm">
                {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => handleCategoryChange('')} className="hover:text-white">
                  <X size={14} />
                </button>
              </span>
            )}
            {sortBy && (
              <span className="flex items-center gap-2 bg-[#d4af37]/10 text-[#d4af37] px-3 py-1.5 rounded-lg text-sm">
                {sortBy === 'trending' ? 'Best Selling' :
                 sortBy === 'new' ? 'Newest' :
                 sortBy === 'price-low' ? 'Price: Low to High' :
                 sortBy === 'price-high' ? 'Price: High to Low' :
                 sortBy === 'name' ? 'Name: A-Z' : sortBy}
                <button onClick={() => handleSortChange('')} className="hover:text-white">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              className="text-[#d4af37] hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
