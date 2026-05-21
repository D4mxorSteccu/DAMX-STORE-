import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, 
  Plus, Edit, Trash2, Check, X, Save, Bell,
  DollarSign, Clock, Star, MessageSquare, Send, QrCode, ExternalLink, Eye, EyeOff,
  ArrowLeft, MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order, Category, Announcement, Feedback } from '../types';

const AdminDashboardPage: React.FC = () => {
  const { 
    isAdmin, adminLogout, products, orders, categories, allUsers,
    addProduct, updateProduct, deleteProduct,
    addCategory, deleteCategory,
    updateOrderStatus, paymentQR, updatePaymentQR,
    announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement,
    feedbacks, updateFeedbackVisibility, deleteFeedback,
    storeStats, telegramConfig, updateTelegramConfig
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  
  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  const pendingOrders = orders.filter(o => o.status === 'pending');
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrders.length },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'telegram', label: 'Telegram', icon: Send },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab stats={storeStats} orders={orders} pendingCount={pendingOrders.length} />;
      case 'products': return <ProductsTab products={products} onAdd={() => { setEditingProduct(null); setShowProductModal(true); }} onEdit={(p) => { setEditingProduct(p); setShowProductModal(true); }} onDelete={deleteProduct} />;
      case 'orders': return <OrdersTab orders={orders} onUpdateStatus={updateOrderStatus} />;
      case 'customers': return <CustomersTab users={allUsers} />;
      case 'feedbacks': return <FeedbacksTab feedbacks={feedbacks} onToggleVisibility={updateFeedbackVisibility} onDelete={deleteFeedback} />;
      case 'announcements': return <AnnouncementsTab announcements={announcements} onAdd={() => setShowAnnouncementModal(true)} onUpdate={updateAnnouncement} onDelete={deleteAnnouncement} />;
      case 'telegram': return <TelegramTab config={telegramConfig} onSave={updateTelegramConfig} />;
      case 'settings': return <SettingsTab paymentQR={paymentQR} onUpdatePaymentQR={updatePaymentQR} />;
      default: return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-white/5 flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-2">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <h1 className="text-xl font-bold text-white">DAMX ADMIN</h1>
          <p className="text-[#d4af37] text-sm">Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors " + (
                activeTab === tab.id 
                  ? "bg-[#d4af37]/10 text-[#d4af37]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <tab.icon size={20} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1a1a1a] border-b border-white/5 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg font-bold text-white">DAMX ADMIN</h1>
          </div>
          <button onClick={adminLogout} className="text-gray-400 hover:text-red-400">
            <LogOut size={20} />
          </button>
        </div>
        <div className="flex overflow-x-auto px-4 pb-4 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors " + (
                activeTab === tab.id 
                  ? "bg-[#d4af37]/10 text-[#d4af37]" 
                  : "text-gray-400 hover:text-white bg-white/5"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-28 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Product Modal */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={editingProduct}
        onSave={(product) => {
          if (editingProduct) {
            updateProduct(editingProduct.id, product);
          } else {
            addProduct(product as Omit<Product, 'id' | 'createdAt'>);
          }
          setShowProductModal(false);
        }}
      />
      
      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        onSave={(announcement) => {
          addAnnouncement(announcement as Omit<Announcement, 'id' | 'createdAt'>);
          setShowAnnouncementModal(false);
        }}
      />
    </div>
  );
};

// Dashboard Tab
const DashboardTab: React.FC<{ 
  stats: { totalSold: number; totalRevenue: number; totalCustomers: number; averageRating: number }; 
  orders: Order[]; 
  pendingCount: number 
}> = ({ stats, orders, pendingCount }) => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
    
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag size={20} className="text-[#d4af37]" />
          <span className="text-gray-500 text-sm">Total Sold</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.totalSold}</p>
      </div>
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign size={20} className="text-green-400" />
          <span className="text-gray-500 text-sm">Revenue</span>
        </div>
        <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
      </div>
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <Users size={20} className="text-blue-400" />
          <span className="text-gray-500 text-sm">Customers</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
      </div>
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
        <div className="flex items-center gap-3 mb-2">
          <Star size={20} className="text-yellow-400" />
          <span className="text-gray-500 text-sm">Rating</span>
        </div>
        <p className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
      </div>
    </div>
    
    {pendingCount > 0 && (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <Clock className="text-yellow-400" size={24} />
          <div>
            <p className="text-yellow-400 font-medium">{pendingCount} pending order{pendingCount > 1 ? 's' : ''} awaiting approval</p>
            <p className="text-yellow-400/60 text-sm">Review and approve payments in Orders tab</p>
          </div>
        </div>
      </div>
    )}
    
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0d0d0d]">
            <tr>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Order ID</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Customer</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Total</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(-5).reverse().map(order => (
              <tr key={order.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white font-mono text-sm">#{order.id}</td>
                <td className="px-4 py-3">
                  <p className="text-white text-sm">{order.username}</p>
                  <p className="text-gray-500 text-xs">{order.whatsapp}</p>
                </td>
                <td className="px-4 py-3 text-white font-medium">${order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={"px-2 py-1 rounded-lg text-xs font-medium " + (
                    order.status === 'pending' ? "bg-yellow-500/10 text-yellow-400" :
                    order.status === 'approved' ? "bg-green-500/10 text-green-400" :
                    "bg-red-500/10 text-red-400"
                  )}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No orders yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Products Tab
const ProductsTab: React.FC<{ 
  products: Product[]; 
  onAdd: () => void; 
  onEdit: (p: Product) => void; 
  onDelete: (id: string) => void 
}> = ({ products, onAdd, onEdit, onDelete }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Products ({products.length})</h2>
      <button 
        onClick={onAdd} 
        className="flex items-center gap-2 bg-[#d4af37] text-black px-4 py-2 rounded-xl font-medium hover:bg-white transition-colors"
      >
        <Plus size={18} /> Add Product
      </button>
    </div>
    
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0d0d0d]">
            <tr>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Product</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Category</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Price</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Sold</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-white font-medium truncate max-w-[200px]">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">{product.category}</td>
                <td className="px-4 py-3 text-white font-medium">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-400">{product.sold}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(product)} className="p-2 text-gray-400 hover:text-[#d4af37] transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Orders Tab
const OrdersTab: React.FC<{ orders: Order[]; onUpdateStatus: (id: string, status: Order['status']) => void }> = ({ orders, onUpdateStatus }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Orders ({orders.length})</h2>
      
      <div className="space-y-4">
        {orders.slice().reverse().map(order => (
          <div key={order.id} className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
            {/* Order Header */}
            <div 
              className="p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/5"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div>
                <p className="text-white font-medium">Order #{order.id}</p>
                <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={"px-3 py-1.5 rounded-lg text-sm font-medium " + (
                  order.status === 'pending' ? "bg-yellow-500/10 text-yellow-400" :
                  order.status === 'approved' ? "bg-green-500/10 text-green-400" :
                  "bg-red-500/10 text-red-400"
                )}>
                  {order.status}
                </span>
                <span className="text-white font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Expanded Content */}
            {expandedOrder === order.id && (
              <div className="p-4 bg-[#0d0d0d]">
                {/* Customer Info */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-[#1a1a1a] rounded-xl">
                  <Users size={18} className="text-gray-500" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{order.username}</p>
                    <p className="text-gray-500 text-xs">{order.whatsapp}</p>
                  </div>
                  <a 
                    href={"https://wa.me/" + order.whatsapp.replace(/[^0-9]/g, '')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle size={18} />
                  </a>
                  <a 
                    href={"https://wa.me/" + order.whatsapp.replace(/[^0-9]/g, '')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#d4af37] hover:text-white p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
                
                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded-lg">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.product.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                {/* Receipt */}
                {order.paymentReceipt && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm mb-2">Payment Receipt:</p>
                    <img src={order.paymentReceipt} alt="Receipt" className="max-h-60 rounded-lg mx-auto" />
                  </div>
                )}
                
                {/* Actions */}
                {order.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'approved'); }} 
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
                    >
                      <Check size={18} /> Approve
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'rejected'); }} 
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
                    >
                      <X size={18} /> Reject
                    </button>
                  </div>
                )}
                
                {order.telegramNotified && (
                  <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                    <Send size={14} /> Telegram notification sent
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">No orders yet</div>
        )}
      </div>
    </div>
  );
};

// Customers Tab
const CustomersTab: React.FC<{ users: { id: string; username: string; whatsapp: string; totalPurchases: number; totalSpent: number; createdAt: string }[] }> = ({ users }) => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6">Customers ({users.length})</h2>
    
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0d0d0d]">
            <tr>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Username</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">WhatsApp</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Purchases</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Total Spent</th>
              <th className="text-left text-gray-500 text-sm font-medium px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium">{user.username}</td>
                <td className="px-4 py-3">
                  <a 
                    href={"https://wa.me/" + user.whatsapp.replace(/[^0-9]/g, '')} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#d4af37] hover:text-white transition-colors"
                  >
                    {user.whatsapp}
                  </a>
                </td>
                <td className="px-4 py-3 text-gray-400">{user.totalPurchases}</td>
                <td className="px-4 py-3 text-white font-medium">${user.totalSpent.toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No customers yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Feedbacks Tab
const FeedbacksTab: React.FC<{ feedbacks: Feedback[]; onToggleVisibility: (id: string, visible: boolean) => void; onDelete: (id: string) => void }> = ({ feedbacks, onToggleVisibility, onDelete }) => (
  <div>
    <h2 className="text-2xl font-bold text-white mb-6">Customer Feedbacks ({feedbacks.length})</h2>
    
    <div className="space-y-4">
      {feedbacks.map(feedback => (
        <div key={feedback.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < feedback.rating ? "text-[#d4af37]" : "text-gray-600"} fill={i < feedback.rating ? "currentColor" : "none"} />
                ))}
                <span className="text-gray-500 text-xs ml-2">{new Date(feedback.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-white font-medium">{feedback.productName}</p>
              <p className="text-gray-400 text-sm mt-1">{feedback.comment}</p>
              <p className="text-gray-500 text-xs mt-2">by {feedback.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleVisibility(feedback.id, !feedback.visible)}
                className={"px-3 py-1.5 rounded-lg text-sm font-medium transition-colors " + (
                  feedback.visible ? "bg-green-500/10 text-green-400" : "bg-gray-500/10 text-gray-400"
                )}
              >
                {feedback.visible ? "Visible" : "Hidden"}
              </button>
              <button onClick={() => onDelete(feedback.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
      {feedbacks.length === 0 && (
        <div className="text-center py-12 text-gray-500">No feedbacks yet</div>
      )}
    </div>
  </div>
);

// Announcements Tab
const AnnouncementsTab: React.FC<{ announcements: Announcement[]; onAdd: () => void; onUpdate: (id: string, updates: Partial<Announcement>) => void; onDelete: (id: string) => void }> = ({ announcements, onAdd, onUpdate, onDelete }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Announcements</h2>
      <button onClick={onAdd} className="flex items-center gap-2 bg-[#d4af37] text-black px-4 py-2 rounded-xl font-medium hover:bg-white transition-colors">
        <Plus size={18} /> Add
      </button>
    </div>
    
    <div className="space-y-4">
      {announcements.map(announcement => (
        <div key={announcement.id} className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={"px-2 py-0.5 rounded text-xs font-medium " + (
                  announcement.type === "warning" ? "bg-yellow-500/10 text-yellow-400" :
                  announcement.type === "success" ? "bg-green-500/10 text-green-400" :
                  "bg-[#d4af37]/10 text-[#d4af37]"
                )}>
                  {announcement.type}
                </span>
                <span className={"text-xs " + (announcement.active ? "text-green-400" : "text-gray-500")}>
                  {announcement.active ? "Active" : "Inactive"}
                </span>
              </div>
              <h3 className="text-white font-medium">{announcement.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{announcement.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdate(announcement.id, { active: !announcement.active })}
                className={"px-3 py-1.5 rounded-lg text-sm font-medium transition-colors " + (
                  announcement.active ? "bg-gray-500/10 text-gray-400" : "bg-green-500/10 text-green-400"
                )}
              >
                {announcement.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => onDelete(announcement.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Telegram Tab
const TelegramTab: React.FC<{ config: { botToken: string; chatId: string; groupId?: string; sendToGroup: boolean; enabled: boolean }; onSave: (config: any) => void }> = ({ config, onSave }) => {
  const [formData, setFormData] = useState(config);
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const testNotification = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${formData.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: formData.chatId,
          text: "✅ *Test Notification from DAMX STORE*\n\nYour Telegram bot is working correctly!",
          parse_mode: 'Markdown',
        }),
      });
      
      const data = await response.json();
      if (data.ok) {
        setTestResult({ success: true, message: 'Test notification sent successfully!' });
      } else {
        setTestResult({ success: false, message: data.description || 'Failed to send notification' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Network error. Check your connection.' });
    }
    
    setTesting(false);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Telegram Notifications</h2>
      
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0088cc]/10 flex items-center justify-center">
            <Send className="text-[#0088cc]" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Auto Notifications</h3>
            <p className="text-gray-500 text-sm">Get notified when customers place orders</p>
          </div>
          <label className="ml-auto flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="w-5 h-5 rounded border-white/20 bg-[#0d0d0d] text-[#d4af37] focus:ring-[#d4af37]"
            />
            <span className="text-gray-400">Enabled</span>
          </label>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Bot Token</label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={formData.botToken}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-1">Get from @BotFather on Telegram</p>
          </div>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Your Chat ID (Personal)</label>
            <input
              type="text"
              value={formData.chatId}
              onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
              placeholder="123456789"
              className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30"
            />
            <p className="text-gray-600 text-xs mt-1">Get from @userinfobot</p>
          </div>
          
          <div className="border-t border-white/5 pt-4">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={formData.sendToGroup}
                onChange={(e) => setFormData({ ...formData, sendToGroup: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-[#0d0d0d] text-[#d4af37] focus:ring-[#d4af37]"
              />
              <span className="text-gray-400">Also send to Telegram Group</span>
            </label>
            
            {formData.sendToGroup && (
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Group Chat ID</label>
                <input
                  type="text"
                  value={formData.groupId || ""}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  placeholder="-1001234567890"
                  className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30"
                />
                <p className="text-gray-600 text-xs mt-1">Add bot to group, then get group ID from @getidsbot</p>
              </div>
            )}
          </div>
          
          {testResult && (
            <div className={"p-3 rounded-xl " + (testResult.success ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400")}>
              {testResult.message}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors"
            >
              <Save size={18} /> Save Configuration
            </button>
            <button
              onClick={testNotification}
              disabled={testing || !formData.botToken || !formData.chatId}
              className={"px-6 py-3 rounded-xl font-medium transition-colors " + (
                testing || !formData.botToken || !formData.chatId
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-[#0088cc] text-white hover:bg-[#0077b5]"
              )}
            >
              {testing ? "Testing..." : "Test"}
            </button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-[#0d0d0d] rounded-xl border border-white/5">
          <h4 className="text-white font-medium mb-2">Setup Guide:</h4>
          <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
            <li>Open Telegram, search @BotFather</li>
            <li>Send /newbot and follow instructions</li>
            <li>Copy the bot token</li>
            <li>Search @userinfobot, send any message</li>
            <li>Copy your Chat ID</li>
            <li>Paste both values above</li>
            <li>Click Test to verify</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab: React.FC<{ paymentQR: { id: string; image: string; name: string; accountNumber?: string; active: boolean }; onUpdatePaymentQR: (qr: any) => void }> = ({ paymentQR, onUpdatePaymentQR }) => {
  const [qrData, setQrData] = useState(paymentQR);
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Payment Settings</h2>
      
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <QrCode className="text-[#d4af37]" size={20} /> Payment QR Code
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">QR Name</label>
              <input
                type="text"
                value={qrData.name}
                onChange={(e) => setQrData({ ...qrData, name: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Account Number</label>
              <input
                type="text"
                value={qrData.accountNumber || ""}
                onChange={(e) => setQrData({ ...qrData, accountNumber: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">QR Image URL</label>
              <input
                type="text"
                value={qrData.image}
                onChange={(e) => setQrData({ ...qrData, image: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            
            <button
              onClick={() => onUpdatePaymentQR(qrData)}
              className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors"
            >
              <Save size={18} /> Save Settings
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-[#0d0d0d] rounded-xl p-6">
            <p className="text-gray-500 text-sm mb-4">Preview</p>
            <div className="bg-white rounded-xl p-4">
              <img src={qrData.image} alt="QR Preview" className="w-48 h-48 object-contain" />
            </div>
            <p className="text-white font-medium mt-4">{qrData.name}</p>
            {qrData.accountNumber && <p className="text-gray-400 text-sm">{qrData.accountNumber}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Modal
const ProductModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  product: Product | null; 
  onSave: (product: Partial<Product>) => void 
}> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "", price: 0, originalPrice: undefined, category: "software", image: "",
    shortDescription: "", fullDescription: "", deliveryType: "auto", deliveryContent: "",
    stock: 999, sold: 0, featured: false
  });
  
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "", price: 0, originalPrice: undefined, category: "software", image: "",
        shortDescription: "", fullDescription: "", deliveryType: "auto", deliveryContent: "",
        stock: 999, sold: 0, featured: false
      });
    }
  }, [product]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] rounded-2xl border border-white/5 w-full max-w-2xl my-8"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#1a1a1a] z-10">
          <h2 className="text-xl font-bold text-white">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Product Name *</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice || ""}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || undefined })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Category *</label>
              <select
                value={formData.category || "software"}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              >
                <option value="software">Software & Apps</option>
                <option value="ebooks">E-Books</option>
                <option value="courses">Courses</option>
                <option value="templates">Templates</option>
                <option value="gaming">Gaming</option>
                <option value="accounts">Accounts</option>
              </select>
            </div>
            
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Delivery Type</label>
              <select
                value={formData.deliveryType || "auto"}
                onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as "auto" | "manual" })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              >
                <option value="auto">Auto (Instant)</option>
                <option value="manual">Manual (Up to 24h)</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Image URL *</label>
              <input
                type="text"
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Short Description *</label>
              <input
                type="text"
                value={formData.shortDescription || ""}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Full Description</label>
              <textarea
                value={formData.fullDescription || ""}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                rows={3}
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30 resize-none"
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Delivery Content (shown after purchase)</label>
              <textarea
                value={formData.deliveryContent || ""}
                onChange={(e) => setFormData({ ...formData, deliveryContent: e.target.value })}
                rows={3}
                placeholder="License key, download link, account credentials, etc."
                className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]/30 resize-none"
              />
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-[#0d0d0d] text-[#d4af37] focus:ring-[#d4af37]"
                />
                <span className="text-gray-400">Featured Product</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 sticky bottom-0 bg-[#1a1a1a]">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2 rounded-xl font-semibold hover:bg-white transition-colors"
          >
            <Save size={18} /> Save Product
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Announcement Modal
const AnnouncementModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (announcement: Partial<Announcement>) => void }> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ title: "", message: "", type: "info" as "info" | "warning" | "success", active: true });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] rounded-2xl border border-white/5 w-full max-w-md">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Announcement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30 resize-none"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "info" | "warning" | "success" })}
              className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/30"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={() => onSave(formData)} className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-2 rounded-xl font-semibold hover:bg-white transition-colors">
            <Save size={18} />Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
