import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, XCircle, ChevronRight, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

const OrdersPage: React.FC = () => {
  const { userOrders } = useApp();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />;
      case 'approved':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
      case 'approved':
        return { text: 'Approved', color: 'text-green-400', bg: 'bg-green-400/10' };
      case 'rejected':
        return { text: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10' };
      default:
        return { text: status, color: 'text-gray-400', bg: 'bg-gray-400/10' };
    }
  };
  
  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-8">You haven't placed any orders yet</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors"
            >
              Browse Products
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
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">Track your order status</p>
        </motion.div>
        
        {/* Orders List */}
        <div className="space-y-4">
          {userOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 sm:p-6 border-b border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="text-white font-medium">Order #{order.id}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusText(order.status).bg} ${getStatusText(order.status).color}`}>
                      {getStatusText(order.status).text}
                    </span>
                    <span className="text-white font-semibold">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {item.product.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-white text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Receipt */}
                {order.paymentReceipt && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-gray-500 text-sm mb-2">Payment Receipt:</p>
                    <img
                      src={order.paymentReceipt}
                      alt="Receipt"
                      className="max-h-32 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
