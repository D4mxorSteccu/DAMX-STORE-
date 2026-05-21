import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full"
      />
    </div>
  );
};

export default LoadingSpinner;
