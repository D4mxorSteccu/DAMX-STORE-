import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, Product, Category, CartItem, Order, PurchasedItem, Announcement, PaymentQR, Feedback, StoreStats, TelegramConfig, ChatSession, ChatMessage } from '../types';
import * as store from '../lib/store';
import { supabase } from '../lib/supabase';

interface AppContextType {
  // User
  user: User | null;
  isLoggedIn: boolean;
  register: (username: string, password: string, whatsapp: string) => Promise<{ success: boolean; message: string }>;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  // Products
  products: Product[];
  categories: Category[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Categories
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Cart
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  refreshCart: () => Promise<void>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Orders
  orders: Order[];
  userOrders: Order[];
  refreshOrders: () => Promise<void>;
  createOrder: (items: CartItem[], total: number, receipt?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Purchased Items
  purchasedItems: PurchasedItem[];
  userPurchasedItems: PurchasedItem[];
  refreshPurchasedItems: () => Promise<void>;
  
  // Payment
  paymentQR: PaymentQR;
  refreshPaymentQR: () => Promise<void>;
  updatePaymentQR: (qr: PaymentQR) => Promise<void>;
  
  // Announcements
  announcements: Announcement[];
  activeAnnouncements: Announcement[];
  refreshAnnouncements: () => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  
  // Feedback
  feedbacks: Feedback[];
  visibleFeedbacks: Feedback[];
  refreshFeedbacks: () => Promise<void>;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => Promise<void>;
  updateFeedbackVisibility: (id: string, visible: boolean) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  
  // Stats
  storeStats: StoreStats;
  refreshStats: () => Promise<void>;
  
  // Telegram
  telegramConfig: TelegramConfig;
  refreshTelegramConfig: () => Promise<void>;
  updateTelegramConfig: (config: TelegramConfig) => Promise<void>;
  
  // Admin
  isAdmin: boolean;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  
  // Users (admin)
  allUsers: User[];
  refreshUsers: () => Promise<void>;
  
  // Chat
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  currentChatSession: ChatSession | null;
  refreshChatSessions: () => Promise<void>;
  loadChatMessages: (sessionId: string) => Promise<void>;
  sendChatMessage: (message: string, attachments?: string[]) => Promise<void>;
  createChatSession: () => Promise<ChatSession | null>;
  setCurrentChatSession: (session: ChatSession | null) => void;
  markChatAsRead: (sessionId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [paymentQR, setPaymentQR] = useState<PaymentQR>({ id: '', image: '', name: '', active: false });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({ botToken: '', chatId: '', groupId: '', sendToGroup: false, enabled: false });
  const [storeStats, setStoreStats] = useState<StoreStats>({ totalSold: 0, totalRevenue: 0, totalCustomers: 0, averageRating: 5 });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentChatSession, setCurrentChatSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Track current chat session for realtime messages
  const currentSessionRef = useRef<string | null>(null);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // ─── REALTIME SUBSCRIPTIONS ───────────────────────────────────────────────

  useEffect(() => {
    // Initialize app
    const init = async () => {
      const storedUser = store.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        userRef.current = storedUser;
      }
      setIsAdmin(store.isAdminLoggedIn());
      await refreshAll(storedUser);
      setLoading(false);
    };
    init();

    // --- Products realtime ---
    const productsSub = supabase
      .channel('realtime:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        refreshProducts();
        refreshStats();
      })
      .subscribe();

    // --- Categories realtime ---
    const categoriesSub = supabase
      .channel('realtime:categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        refreshCategories();
      })
      .subscribe();

    // --- Orders realtime ---
    const ordersSub = supabase
      .channel('realtime:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        refreshOrders();
        refreshStats();
        refreshPurchasedItems();
      })
      .subscribe();

    // --- Announcements realtime ---
    const announcementsSub = supabase
      .channel('realtime:announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        refreshAnnouncements();
      })
      .subscribe();

    // --- Feedbacks realtime ---
    const feedbacksSub = supabase
      .channel('realtime:feedbacks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedbacks' }, () => {
        refreshFeedbacks();
        refreshStats();
      })
      .subscribe();

    // --- Payment QR realtime ---
    const paymentSub = supabase
      .channel('realtime:payment_qr')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_qr' }, () => {
        refreshPaymentQR();
      })
      .subscribe();

    // --- Chat sessions realtime ---
    const chatSessionsSub = supabase
      .channel('realtime:chat_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, () => {
        refreshChatSessions();
      })
      .subscribe();

    // --- Chat messages realtime ---
    const chatMessagesSub = supabase
      .channel('realtime:chat_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, (payload: any) => {
        const newMsg = payload.new;
        // Only add to state if it belongs to current open session
        if (currentSessionRef.current && newMsg?.session_id === currentSessionRef.current) {
          const mapped: ChatMessage = {
            id: newMsg.id,
            senderId: newMsg.sender_id,
            senderName: newMsg.sender_name,
            senderType: newMsg.sender_type,
            receiverId: newMsg.receiver_id,
            message: newMsg.message,
            attachments: newMsg.attachments,
            createdAt: newMsg.created_at,
            read: newMsg.read
          };
          setChatMessages(prev => {
            // Avoid duplicates
            if (prev.find(m => m.id === mapped.id)) return prev;
            return [...prev, mapped];
          });
        }
        refreshChatSessions();
      })
      .subscribe();

    // --- Cart realtime (user-specific) ---
    const cartSub = supabase
      .channel('realtime:cart_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items' }, () => {
        if (userRef.current) {
          refreshCart();
        }
      })
      .subscribe();

    // --- Users realtime (admin) ---
    const usersSub = supabase
      .channel('realtime:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        refreshUsers();
        refreshStats();
      })
      .subscribe();

    // Cleanup all subscriptions on unmount
    return () => {
      supabase.removeChannel(productsSub);
      supabase.removeChannel(categoriesSub);
      supabase.removeChannel(ordersSub);
      supabase.removeChannel(announcementsSub);
      supabase.removeChannel(feedbacksSub);
      supabase.removeChannel(paymentSub);
      supabase.removeChannel(chatSessionsSub);
      supabase.removeChannel(chatMessagesSub);
      supabase.removeChannel(cartSub);
      supabase.removeChannel(usersSub);
    };
  }, []);

  // ─── REFRESH FUNCTIONS ────────────────────────────────────────────────────

  const refreshAll = async (currentUser?: User | null) => {
    const u = currentUser ?? userRef.current;
    await Promise.all([
      refreshProducts(),
      refreshCategories(),
      refreshOrders(),
      refreshPurchasedItems(),
      refreshPaymentQR(),
      refreshAnnouncements(),
      refreshFeedbacks(),
      refreshStats(),
      refreshTelegramConfig(),
      refreshUsers(),
      refreshChatSessions(),
      ...(u ? [refreshCartForUser(u)] : [])
    ]);
  };

  const refreshCartForUser = async (u: User) => {
    const data = await store.getCart();
    setCart(data);
  };

  // ─── USER ─────────────────────────────────────────────────────────────────

  const register = async (username: string, password: string, whatsapp: string) => {
    const result = await store.registerUser(username, password, whatsapp);
    if (result.success && result.user) {
      setUser(result.user);
      userRef.current = result.user;
      await refreshUsers();
      await refreshCart();
    }
    return result;
  };

  const login = async (username: string, password: string) => {
    const result = await store.loginUser(username, password);
    if (result.success && result.user) {
      setUser(result.user);
      userRef.current = result.user;
      await refreshCart();
    }
    return result;
  };

  const logout = () => {
    store.logoutUser();
    setUser(null);
    userRef.current = null;
    setCart([]);
    setCurrentChatSession(null);
    currentSessionRef.current = null;
  };

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────

  const refreshProducts = async () => {
    const data = await store.getProducts();
    setProducts(data);
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    await store.addProduct(product);
    // Realtime will auto-trigger refreshProducts
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await store.updateProduct(id, updates);
    // Realtime will auto-trigger refreshProducts
  };

  const deleteProduct = async (id: string) => {
    await store.deleteProduct(id);
    // Realtime will auto-trigger refreshProducts
  };

  // ─── CATEGORIES ──────────────────────────────────────────────────────────

  const refreshCategories = async () => {
    const data = await store.getCategories();
    setCategories(data);
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    await store.addCategory(category);
  };

  const deleteCategory = async (id: string) => {
    await store.deleteCategory(id);
  };

  // ─── CART ─────────────────────────────────────────────────────────────────

  const refreshCart = async () => {
    const data = await store.getCart();
    setCart(data);
  };

  const addToCart = async (product: Product) => {
    const data = await store.addToCart(product);
    setCart(data);
  };

  const removeFromCart = async (itemId: string) => {
    const data = await store.removeFromCart(itemId);
    setCart(data);
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    const data = await store.updateCartQuantity(itemId, quantity);
    setCart(data);
  };

  const clearCart = async () => {
    await store.clearCart();
    setCart([]);
  };

  // ─── ORDERS ──────────────────────────────────────────────────────────────

  const refreshOrders = async () => {
    const data = await store.getOrders();
    setOrders(data);
  };

  const createOrder = async (items: CartItem[], total: number, receipt?: string) => {
    const order = await store.createOrder(items, total, receipt);
    // Realtime will auto-refresh orders
    return order;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await store.updateOrderStatus(orderId, status);
    // Realtime will auto-refresh
  };

  // ─── PURCHASED ITEMS ──────────────────────────────────────────────────────

  const refreshPurchasedItems = async () => {
    const data = await store.getPurchasedItems();
    setPurchasedItems(data);
  };

  // ─── PAYMENT QR ──────────────────────────────────────────────────────────

  const refreshPaymentQR = async () => {
    const data = await store.getPaymentQR();
    setPaymentQR(data);
  };

  const updatePaymentQR = async (qr: PaymentQR) => {
    await store.savePaymentQR(qr);
    // Realtime will auto-refresh
  };

  // ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────

  const refreshAnnouncements = async () => {
    const data = await store.getAnnouncements();
    setAnnouncements(data);
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    await store.addAnnouncement(announcement);
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    await store.updateAnnouncement(id, updates);
  };

  const deleteAnnouncement = async (id: string) => {
    await store.deleteAnnouncement(id);
  };

  // ─── FEEDBACK ────────────────────────────────────────────────────────────

  const refreshFeedbacks = async () => {
    const data = await store.getFeedbacks();
    setFeedbacks(data);
  };

  const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    await store.addFeedback(feedback);
    await refreshPurchasedItems();
  };

  const updateFeedbackVisibility = async (id: string, visible: boolean) => {
    await store.updateFeedbackVisibility(id, visible);
  };

  const deleteFeedback = async (id: string) => {
    await store.deleteFeedback(id);
  };

  // ─── STATS ───────────────────────────────────────────────────────────────

  const refreshStats = async () => {
    const data = await store.getStoreStats();
    setStoreStats(data);
  };

  // ─── TELEGRAM ────────────────────────────────────────────────────────────

  const refreshTelegramConfig = async () => {
    const data = await store.getTelegramConfig();
    setTelegramConfig(data);
  };

  const updateTelegramConfig = async (config: TelegramConfig) => {
    await store.saveTelegramConfig(config);
    await refreshTelegramConfig();
  };

  // ─── ADMIN ───────────────────────────────────────────────────────────────

  const adminLogin = async (password: string): Promise<boolean> => {
    const success = await store.verifyAdminPassword(password);
    if (success) {
      store.setAdminSession(true);
      setIsAdmin(true);
    }
    return success;
  };

  const adminLogout = () => {
    store.setAdminSession(false);
    setIsAdmin(false);
  };

  // ─── USERS ───────────────────────────────────────────────────────────────

  const refreshUsers = async () => {
    const data = await store.getUsers();
    setAllUsers(data);
  };

  // ─── CHAT ────────────────────────────────────────────────────────────────

  const refreshChatSessions = async () => {
    const data = await store.getChatSessions();
    setChatSessions(data);
  };

  const loadChatMessages = async (sessionId: string) => {
    currentSessionRef.current = sessionId;
    const data = await store.getChatMessages(sessionId);
    setChatMessages(data);
  };

  const sendChatMessageFn = async (message: string, attachments?: string[]) => {
    const u = userRef.current;
    if (!currentChatSession || !u) return;

    await store.sendChatMessage(
      currentChatSession.id,
      isAdmin ? 'admin' : u.id,
      isAdmin ? 'DAMX Support' : u.username,
      isAdmin ? 'admin' : 'customer',
      message,
      attachments
    );
    // Realtime subscription will push new message into state
  };

  const createChatSessionFn = async (): Promise<ChatSession | null> => {
    const u = userRef.current;
    if (!u) return null;
    const session = await store.createChatSession(u.id, u.username, u.whatsapp);
    setCurrentChatSession(session);
    currentSessionRef.current = session.id;
    await refreshChatSessions();
    return session;
  };

  const setCurrentChatSessionFn = (session: ChatSession | null) => {
    setCurrentChatSession(session);
    currentSessionRef.current = session?.id ?? null;
  };

  const markChatAsReadFn = async (sessionId: string) => {
    await store.markChatAsRead(sessionId);
    await refreshChatSessions();
  };

  // ─── DERIVED VALUES ──────────────────────────────────────────────────────

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const userOrders = orders.filter(o => o.userId === user?.id);
  const userPurchasedItems = purchasedItems.filter(i => i.userId === user?.id);
  const activeAnnouncements = announcements.filter(a => a.active);
  const visibleFeedbacks = feedbacks.filter(f => f.visible);

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn: !!user,
      register,
      login,
      logout,
      products,
      categories,
      loading,
      refreshProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      cart,
      cartTotal,
      cartCount,
      refreshCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      userOrders,
      refreshOrders,
      createOrder,
      updateOrderStatus,
      purchasedItems,
      userPurchasedItems,
      refreshPurchasedItems,
      paymentQR,
      refreshPaymentQR,
      updatePaymentQR,
      announcements,
      activeAnnouncements,
      refreshAnnouncements,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      feedbacks,
      visibleFeedbacks,
      refreshFeedbacks,
      addFeedback,
      updateFeedbackVisibility,
      deleteFeedback,
      storeStats,
      refreshStats,
      telegramConfig,
      refreshTelegramConfig,
      updateTelegramConfig,
      isAdmin,
      adminLogin,
      adminLogout,
      allUsers,
      refreshUsers,
      chatSessions,
      chatMessages,
      currentChatSession,
      refreshChatSessions,
      loadChatMessages,
      sendChatMessage: sendChatMessageFn,
      createChatSession: createChatSessionFn,
      setCurrentChatSession: setCurrentChatSessionFn,
      markChatAsRead: markChatAsReadFn
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
