import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Trash2, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CartItemComponent from '../components/CartItem';

const CartPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
              Shopping Cart
            </h1>
            <p className="text-gray-500 mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors text-sm"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            </AnimatePresence>
          </div>
          
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 bg-[#d4af37] text-black py-4 rounded-xl font-semibold hover:bg-white transition-colors mb-4"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </motion.button>
              
              <Link
                to="/products"
                className="block text-center text-gray-400 hover:text-[#d4af37] transition-colors text-sm"
              >
                Continue Shopping
              </Link>
            </div>
            
            {/* Support */}
            <div className="mt-4 bg-[#1a1a1a] rounded-2xl p-4 border border-white/5">
              <p className="text-gray-500 text-sm mb-3">Need help with your order?</p>
              <a
                href="https://t.me/D4mxorx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors text-sm"
              >
                <MessageCircle size={16} />
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
