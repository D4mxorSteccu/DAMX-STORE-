import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Download, Copy, Check, ExternalLink, FileText, ShoppingBag, Star, X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MyItemsPage: React.FC = () => {
  const { userPurchasedItems, addFeedback } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ratingModal, setRatingModal] = useState<{ itemId: string; productName: string; orderId: string; productId: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const handleSubmitRating = () => {
    if (!ratingModal || !comment.trim()) return;
    setSubmitting(true);
    
    setTimeout(() => {
      addFeedback({
        orderId: ratingModal.orderId,
        productId: ratingModal.productId,
        productName: ratingModal.productName,
        userId: userPurchasedItems.find(i => i.id === ratingModal.itemId)?.userId || '',
        username: 'Customer',
        rating,
        comment: comment.trim(),
        visible: true
      });
      
      setRatingModal(null);
      setRating(5);
      setComment('');
      setSubmitting(false);
    }, 800);
  };
  
  if (userPurchasedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Items Yet</h2>
            <p className="text-gray-500 mb-8">Your purchased items will appear here after approval</p>
            <Link to="/orders" className="inline-flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>My Items</h1>
          <p className="text-gray-500 mt-1">Access your purchased digital products</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userPurchasedItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/5">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Purchased {new Date(item.purchasedAt).toLocaleDateString()}</p>
                    <span className="inline-flex items-center gap-1 text-green-400 text-xs mt-2">
                      <Package size={12} />
                      Delivered
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                {item.deliveryContent && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <FileText size={14} />
                      Delivery Content
                    </div>
                    <div className="bg-[#0d0d0d] rounded-xl p-4 border border-white/5">
                      <p className="text-gray-300 text-sm whitespace-pre-line">{item.deliveryContent}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {item.deliveryContent && (
                    <button onClick={() => copyToClipboard(item.deliveryContent!, item.id)} className="flex items-center gap-2 bg-[#d4af37]/10 text-[#d4af37] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d4af37]/20 transition-colors">
                      {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                      {copiedId === item.id ? 'Copied!' : 'Copy Content'}
                    </button>
                  )}
                  
                  {item.deliveryFiles && item.deliveryFiles.length > 0 && (
                    <button className="flex items-center gap-2 bg-[#d4af37] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                      <Download size={16} />
                      Download Files
                    </button>
                  )}
                  
                  {item.deliveryContent?.startsWith('http') && (
                    <a href={item.deliveryContent} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                      <ExternalLink size={16} />
                      Open Link
                    </a>
                  )}
                  
                  {!item.rated && (
                    <button onClick={() => setRatingModal({ itemId: item.id, productName: item.product.name, orderId: item.orderId, productId: item.productId })} className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                      <Star size={16} />
                      Rate Product
                    </button>
                  )}
                  
                  {item.rated && (
                    <span className="flex items-center gap-1 text-green-400 text-sm px-4 py-2">
                      <Check size={16} />
                      Rated
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {ratingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#1a1a1a] rounded-2xl border border-white/5 w-full max-w-md overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Rate Product</h3>
                <button onClick={() => setRatingModal(null)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-4">How was your experience with <span className="text-white font-medium">{ratingModal.productName}</span>?</p>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setRating(star)} className="p-1">
                      <Star size={32} className={star <= rating ? 'text-[#d4af37]' : 'text-gray-600'} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience (required)" rows={4} className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 resize-none" />
              </div>
              
              <div className="p-4 border-t border-white/5 flex gap-3">
                <button onClick={() => setRatingModal(null)} className="flex-1 py-3 rounded-xl text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSubmitRating} disabled={!comment.trim() || submitting} className="flex-1 flex items-center justify-center gap-2 bg-[#d4af37] text-black py-3 rounded-xl font-semibold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Send size={16} />Submit</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyItemsPage;
