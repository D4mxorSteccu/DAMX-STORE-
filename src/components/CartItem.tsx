import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useApp } from '../context/AppContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateCartQuantity } = useApp();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5"
    >
      {/* Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm sm:text-base truncate">
          {item.product.name}
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          {item.product.category}
        </p>
        <p className="text-[#d4af37] font-semibold mt-2">
          ${item.product.price.toFixed(2)}
        </p>
      </div>
      
      {/* Quantity & Actions */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-gray-500 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={18} />
        </button>
        
        <div className="flex items-center gap-2 bg-[#0d0d0d] rounded-lg p-1">
          <button
            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="text-white text-sm font-medium w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
