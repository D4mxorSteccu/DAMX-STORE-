import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Clock, Shield, ChevronRight, Minus, Plus, Check, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, cart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== id).slice(0, 4);
  
  const inCart = cart.find(item => item.productId === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
          <Link to="/products" className="text-[#d4af37] hover:text-white transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
        >
          <Link to="/products" className="hover:text-[#d4af37] transition-colors flex items-center gap-1">
            <ArrowLeft size={16} />
            Products
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#d4af37]">{product.name}</span>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-[#d4af37] text-black text-sm font-bold px-3 py-1.5 rounded-lg">
                -{discount}% OFF
              </div>
            )}
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category */}
            <Link 
              to={`/products?category=${product.category}`}
              className="text-[#d4af37] text-sm font-medium uppercase tracking-wider mb-2 hover:text-white transition-colors"
            >
              {product.category}
            </Link>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {product.name}
            </h1>
            
            {/* Rating & Sold */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#d4af37]" fill="currentColor" />
                ))}
              </div>
              <span className="text-gray-500 text-sm">{product.sold}+ sold</span>
            </div>
            
            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 text-xl line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Short Description */}
            <p className="text-gray-400 mb-6 leading-relaxed">
              {product.shortDescription}
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
                <Clock className="text-[#d4af37]" size={20} />
                <div>
                  <p className="text-white text-sm font-medium">Delivery</p>
                  <p className="text-gray-500 text-xs">
                    {product.deliveryType === 'auto' ? 'Instant' : 'Within 24h'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/5">
                <Shield className="text-[#d4af37]" size={20} />
                <div>
                  <p className="text-white text-sm font-medium">Warranty</p>
                  <p className="text-gray-500 text-xs">Included</p>
                </div>
              </div>
            </div>
            
            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-400 text-sm">Quantity:</span>
              <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1 border border-white/5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center text-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-colors ${
                  added 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#d4af37] text-black hover:bg-white'
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Add to Cart
                  </>
                )}
              </motion.button>
              
              {inCart && (
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-xl text-[#d4af37] font-medium hover:bg-[#d4af37]/10 transition-colors"
                >
                  View Cart ({inCart.quantity})
                </Link>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Full Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
          <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
              {product.fullDescription}
            </p>
          </div>
        </motion.div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
