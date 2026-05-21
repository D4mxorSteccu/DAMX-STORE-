import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Check, AlertCircle, QrCode, Copy, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, createOrder, clearCart, paymentQR, user } = useApp();
  const navigate = useNavigate();
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Link to="/products" className="text-[#d4af37] hover:text-white transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    if (!receiptFile) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const order = await createOrder(cart, cartTotal, receiptPreview || undefined);
    setOrderId(order.id);
    clearCart();
    setSubmitting(false);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (orderId) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Submitted!</h2>
            <p className="text-gray-400 mb-6">Your order has been submitted successfully. We will review your payment and approve it shortly.</p>
            <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 border border-white/5">
              <p className="text-gray-500 text-sm mb-1">Order ID</p>
              <p className="text-[#d4af37] font-mono font-semibold">{orderId}</p>
            </div>
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl p-4 mb-6">
              <p className="text-[#d4af37] text-sm">📱 You will be notified via WhatsApp once your order is approved.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/orders" className="flex items-center justify-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors">View My Orders</Link>
              <Link to="/products" className="flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-semibold border border-white/10 hover:border-[#d4af37]/30 transition-colors">Continue Shopping</Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/cart" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Checkout</h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 mb-6">
          <p className="text-gray-500 text-sm mb-1">Ordering as</p>
          <p className="text-white font-medium">{user?.username}</p>
          <p className="text-gray-400 text-sm">{user?.whatsapp}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <QrCode className="text-[#d4af37]" size={20} />
                Payment QR
              </h2>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-xl p-4 mb-4">
                  <img src={paymentQR.image} alt="Payment QR" className="w-48 h-48 object-contain" />
                </div>
                <p className="text-white font-medium mb-1">{paymentQR.name}</p>
                {paymentQR.accountNumber && (
                  <button onClick={() => copyToClipboard(paymentQR.accountNumber!)} className="flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors">
                    <span className="font-mono">{paymentQR.accountNumber}</span>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            </div>
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-[#d4af37] flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-[#d4af37] font-medium text-sm mb-1">Payment Instructions</p>
                  <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
                    <li>Scan the QR code or use the account number</li>
                    <li>Transfer the exact amount: <span className="text-white font-semibold">${cartTotal.toFixed(2)}</span></li>
                    <li>Upload your payment receipt below</li>
                    <li>Wait for order confirmation (usually within 1-24 hours)</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Upload Receipt</h2>
              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${receiptPreview ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5'}`}>
                  {receiptPreview ? (
                    <div>
                      <img src={receiptPreview} alt="Receipt" className="max-h-48 mx-auto rounded-lg mb-3" />
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <Check size={18} />
                        Receipt uploaded
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-gray-500 mx-auto mb-3" size={32} />
                      <p className="text-gray-400 text-sm">Click to upload your payment receipt</p>
                      <p className="text-gray-600 text-xs mt-1">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate flex-1">{item.product.name} x{item.quantity}</span>
                    <span className="text-white ml-4">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 pt-4 mb-6">
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: receiptFile ? 1.02 : 1 }}
                whileTap={{ scale: receiptFile ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={!receiptFile || submitting}
                className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${receiptFile ? 'bg-[#d4af37] text-black hover:bg-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Submit Order
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
