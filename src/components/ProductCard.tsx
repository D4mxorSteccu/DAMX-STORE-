import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useApp();
  
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#d4af37]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/5">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-[#d4af37] text-black text-xs font-bold px-2 py-1 rounded-lg">
                -{discount}%
              </div>
            )}
            {product.featured && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-[#d4af37] text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                Featured
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="w-12 h-12 rounded-full bg-[#d4af37] text-black flex items-center justify-center hover:bg-white transition-colors"
              >
                <ShoppingBag size={20} />
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center"
              >
                <Eye size={20} />
              </motion.div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className="text-[#d4af37] text-xs font-medium uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="text-white font-medium text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-[#d4af37] transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3">
              {product.shortDescription}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold text-lg">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 text-sm line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-gray-600 text-xs">
                {product.sold} sold
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
