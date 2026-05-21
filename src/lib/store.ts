import { User, Product, Category, Order, PurchasedItem, Announcement, PaymentQR, CartItem, Feedback, StoreStats, TelegramConfig, ChatMessage, ChatSession } from '../types';
import { supabase, generateId } from './supabase';

// ============ USERS ============
export const registerUser = async (username: string, password: string, whatsapp: string): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    // Check if username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase())
      .single();
    
    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Check if whatsapp exists
    const { data: existingWhatsapp } = await supabase
      .from('users')
      .select('id')
      .eq('whatsapp', whatsapp)
      .single();
    
    if (existingWhatsapp) {
      return { success: false, message: 'WhatsApp number already registered' };
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password, whatsapp, total_purchases: 0, total_spent: 0 }])
      .select()
      .single();
    
    if (error) throw error;
    
    const user: User = {
      id: data.id,
      username: data.username,
      password: data.password,
      whatsapp: data.whatsapp,
      createdAt: data.created_at,
      totalPurchases: data.total_purchases,
      totalSpent: data.total_spent
    };
    
    // Store in session
    sessionStorage.setItem('damx_user', JSON.stringify(user));
    
    return { success: true, message: 'Registration successful', user };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: 'Registration failed' };
  }
};

export const loginUser = async (username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('password', password)
      .single();
    
    if (error || !data) {
      return { success: false, message: 'Invalid username or password' };
    }
    
    const user: User = {
      id: data.id,
      username: data.username,
      password: data.password,
      whatsapp: data.whatsapp,
      createdAt: data.created_at,
      totalPurchases: data.total_purchases,
      totalSpent: data.total_spent
    };
    
    sessionStorage.setItem('damx_user', JSON.stringify(user));
    
    return { success: true, message: 'Login successful', user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const stored = sessionStorage.getItem('damx_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  sessionStorage.removeItem('damx_user');
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  return (data || []).map(d => ({
    id: d.id,
    username: d.username,
    password: d.password,
    whatsapp: d.whatsapp,
    createdAt: d.created_at,
    totalPurchases: d.total_purchases,
    totalSpent: d.total_spent
  }));
};

// ============ PRODUCTS ============
export const getProducts = async (): Promise<Product[]> => {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  return (data || []).map(d => ({
    id: d.id,
    name: d.name,
    price: d.price,
    originalPrice: d.original_price,
    category: d.category,
    image: d.image,
    shortDescription: d.short_description,
    fullDescription: d.full_description,
    deliveryType: d.delivery_type,
    deliveryContent: d.delivery_content,
    deliveryFiles: d.delivery_files,
    stock: d.stock,
    sold: d.sold,
    featured: d.featured,
    createdAt: d.created_at
  }));
};

export const getProduct = async (id: string): Promise<Product | undefined> => {
  const { data } = await supabase.from('products').select('*').eq('id', id).single();
  if (!data) return undefined;
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    originalPrice: data.original_price,
    category: data.category,
    image: data.image,
    shortDescription: data.short_description,
    fullDescription: data.full_description,
    deliveryType: data.delivery_type,
    deliveryContent: data.delivery_content,
    deliveryFiles: data.delivery_files,
    stock: data.stock,
    sold: data.sold,
    featured: data.featured,
    createdAt: data.created_at
  };
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
  await supabase.from('products').insert([{
    name: product.name,
    price: product.price,
    original_price: product.originalPrice,
    category: product.category,
    image: product.image,
    short_description: product.shortDescription,
    full_description: product.fullDescription,
    delivery_type: product.deliveryType,
    delivery_content: product.deliveryContent,
    delivery_files: product.deliveryFiles,
    stock: product.stock,
    sold: product.sold || 0,
    featured: product.featured
  }]);
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice;
  if (updates.category) updateData.category = updates.category;
  if (updates.image) updateData.image = updates.image;
  if (updates.shortDescription) updateData.short_description = updates.shortDescription;
  if (updates.fullDescription) updateData.full_description = updates.fullDescription;
  if (updates.deliveryType) updateData.delivery_type = updates.deliveryType;
  if (updates.deliveryContent) updateData.delivery_content = updates.deliveryContent;
  if (updates.stock !== undefined) updateData.stock = updates.stock;
  if (updates.sold !== undefined) updateData.sold = updates.sold;
  if (updates.featured !== undefined) updateData.featured = updates.featured;
  
  await supabase.from('products').update(updateData).eq('id', id);
};

export const deleteProduct = async (id: string) => {
  await supabase.from('products').delete().eq('id', id);
};

// ============ CATEGORIES ============
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await supabase.from('categories').select('*').order('name');
  return (data || []).map(d => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    image: d.image
  }));
};

export const addCategory = async (category: Omit<Category, 'id'>) => {
  await supabase.from('categories').insert([{
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image
  }]);
};

export const deleteCategory = async (id: string) => {
  await supabase.from('categories').delete().eq('id', id);
};

// ============ CART ============
export const getCart = async (): Promise<CartItem[]> => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const { data } = await supabase
    .from('cart_items')
    .select('id, quantity, product_id, products(*)')
    .eq('user_id', user.id);
  
  return (data || []).map((d: any) => {
    const product = Array.isArray(d.products) ? d.products[0] : d.products;
    return {
      id: d.id,
      productId: d.product_id,
      product: {
        id: product?.id || '',
        name: product?.name || '',
        price: product?.price || 0,
        originalPrice: product?.original_price,
        category: product?.category || '',
        image: product?.image || '',
        shortDescription: product?.short_description || '',
        fullDescription: product?.full_description || '',
        deliveryType: product?.delivery_type || 'auto',
        deliveryContent: product?.delivery_content,
        stock: product?.stock || 0,
        sold: product?.sold || 0,
        featured: product?.featured || false,
        createdAt: product?.created_at || ''
      },
      quantity: d.quantity
    };
  });
};

export const addToCart = async (product: Product): Promise<CartItem[]> => {
  const user = getCurrentUser();
  if (!user) return [];
  
  // Check if already in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', product.id)
    .single();
  
  if (existing) {
    await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('cart_items')
      .insert([{ user_id: user.id, product_id: product.id, quantity: 1 }]);
  }
  
  return getCart();
};

export const removeFromCart = async (itemId: string): Promise<CartItem[]> => {
  await supabase.from('cart_items').delete().eq('id', itemId);
  return getCart();
};

export const updateCartQuantity = async (itemId: string, quantity: number): Promise<CartItem[]> => {
  await supabase.from('cart_items').update({ quantity: Math.max(1, quantity) }).eq('id', itemId);
  return getCart();
};

export const clearCart = async () => {
  const user = getCurrentUser();
  if (!user) return;
  await supabase.from('cart_items').delete().eq('user_id', user.id);
};

// ============ ORDERS ============
export const getOrders = async (): Promise<Order[]> => {
  const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
  
  return (data || []).map(d => ({
    id: d.id,
    userId: d.user_id,
    username: d.username,
    whatsapp: d.whatsapp,
    items: (d.order_items || []).map((i: any) => ({
      id: i.id,
      productId: i.product_id,
      product: {
        id: i.product_id,
        name: i.product_name,
        image: i.product_image,
        price: i.price,
        shortDescription: '',
        fullDescription: '',
        category: '',
        deliveryType: 'auto',
        stock: 0,
        sold: 0,
        featured: false,
        createdAt: ''
      },
      quantity: i.quantity
    })),
    total: d.total,
    status: d.status,
    paymentReceipt: d.payment_receipt,
    telegramNotified: d.telegram_notified,
    createdAt: d.created_at,
    updatedAt: d.updated_at
  }));
};

export const createOrder = async (items: CartItem[], total: number, receipt?: string): Promise<Order> => {
  const user = getCurrentUser();
  
  const { data: order } = await supabase
    .from('orders')
    .insert([{
      user_id: user?.id,
      username: user?.username,
      whatsapp: user?.whatsapp,
      total,
      status: 'pending',
      payment_receipt: receipt
    }])
    .select()
    .single();
  
  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.product.name,
    product_image: item.product.image,
    price: item.product.price,
    quantity: item.quantity
  }));
  
  await supabase.from('order_items').insert(orderItems);
  
  // Clear cart
  await clearCart();
  
  // Send telegram notification
  const newOrder: Order = {
    id: order.id,
    userId: order.user_id,
    username: order.username,
    whatsapp: order.whatsapp,
    items,
    total,
    status: 'pending',
    paymentReceipt: receipt,
    telegramNotified: false,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
  
  await sendTelegramNotification(newOrder);
  
  return newOrder;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
  
  // If approved, add to purchased items
  if (status === 'approved') {
    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();
    
    if (order) {
      const purchasedItems = order.order_items.map((item: any) => ({
        user_id: order.user_id,
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        rated: false
      }));
      
      await supabase.from('purchased_items').insert(purchasedItems);
      
      // Update user stats
      const { data: user } = await supabase.from('users').select('*').eq('id', order.user_id).single();
      if (user) {
        await supabase.from('users').update({
          total_purchases: user.total_purchases + order.order_items.length,
          total_spent: user.total_spent + order.total
        }).eq('id', order.user_id);
      }
      
      // Update product sold count
      for (const item of order.order_items) {
        const { data: product } = await supabase.from('products').select('sold').eq('id', item.product_id).single();
        if (product) {
          await supabase.from('products').update({ sold: product.sold + item.quantity }).eq('id', item.product_id);
        }
      }
    }
  }
};

// ============ PURCHASED ITEMS ============
export const getPurchasedItems = async (): Promise<PurchasedItem[]> => {
  const { data } = await supabase.from('purchased_items').select('*').order('purchased_at', { ascending: false });
  
  return (data || []).map(d => ({
    id: d.id,
    orderId: d.order_id,
    productId: d.product_id,
    product: {
      id: d.product_id,
      name: d.product_name,
      price: 0,
      shortDescription: '',
      fullDescription: '',
      category: '',
      image: '',
      deliveryType: 'auto',
      stock: 0,
      sold: 0,
      featured: false,
      createdAt: ''
    },
    userId: d.user_id,
    deliveryContent: d.delivery_content,
    deliveryFiles: d.delivery_files,
    purchasedAt: d.purchased_at,
    rated: d.rated
  }));
};

export const getUserPurchasedItems = async (userId: string): Promise<PurchasedItem[]> => {
  const { data } = await supabase.from('purchased_items').select('*').eq('user_id', userId).order('purchased_at', { ascending: false });
  
  return (data || []).map(d => ({
    id: d.id,
    orderId: d.order_id,
    productId: d.product_id,
    product: {
      id: d.product_id,
      name: d.product_name,
      price: 0,
      shortDescription: '',
      fullDescription: '',
      category: '',
      image: '',
      deliveryType: 'auto',
      stock: 0,
      sold: 0,
      featured: false,
      createdAt: ''
    },
    userId: d.user_id,
    deliveryContent: d.delivery_content,
    deliveryFiles: d.delivery_files,
    purchasedAt: d.purchased_at,
    rated: d.rated
  }));
};

// ============ FEEDBACK ============
export const getFeedbacks = async (): Promise<Feedback[]> => {
  const { data } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
  return (data || []).map(d => ({
    id: d.id,
    orderId: d.order_id,
    productId: d.product_id,
    productName: d.product_name,
    userId: d.user_id,
    username: d.username,
    rating: d.rating,
    comment: d.comment,
    visible: d.visible,
    createdAt: d.created_at
  }));
};

export const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
  await supabase.from('feedbacks').insert([{
    user_id: feedback.userId,
    order_id: feedback.orderId,
    product_id: feedback.productId,
    product_name: feedback.productName,
    username: feedback.username,
    rating: feedback.rating,
    comment: feedback.comment,
    visible: feedback.visible
  }]);
  
  // Mark as rated
  await supabase.from('purchased_items').update({ rated: true }).eq('order_id', feedback.orderId);
};

export const updateFeedbackVisibility = async (id: string, visible: boolean) => {
  await supabase.from('feedbacks').update({ visible }).eq('id', id);
};

export const deleteFeedback = async (id: string) => {
  await supabase.from('feedbacks').delete().eq('id', id);
};

// ============ ANNOUNCEMENTS ============
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
  return (data || []).map(d => ({
    id: d.id,
    title: d.title,
    message: d.message,
    type: d.type,
    active: d.active,
    createdAt: d.created_at
  }));
};

export const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
  await supabase.from('announcements').insert([announcement]);
};

export const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
  await supabase.from('announcements').update(updates).eq('id', id);
};

export const deleteAnnouncement = async (id: string) => {
  await supabase.from('announcements').delete().eq('id', id);
};

// ============ PAYMENT QR ============
export const getPaymentQR = async (): Promise<PaymentQR> => {
  const { data } = await supabase.from('payment_qr').select('*').eq('active', true).single();
  if (!data) {
    return {
      id: '1',
      image: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment-damx',
      name: 'DAMX STORE Payment',
      accountNumber: 'XXXX-XXXX-8675',
      active: true
    };
  }
  return {
    id: data.id,
    image: data.image,
    name: data.name,
    accountNumber: data.account_number,
    active: data.active
  };
};

export const savePaymentQR = async (qr: PaymentQR) => {
  await supabase.from('payment_qr').update({
    name: qr.name,
    image: qr.image,
    account_number: qr.accountNumber,
    active: qr.active
  }).eq('id', qr.id);
};

// ============ TELEGRAM ============
export const getTelegramConfig = async (): Promise<TelegramConfig> => {
  const { data } = await supabase.from('telegram_config').select('*').single();
  if (!data) {
    return {
      botToken: '8543897669:AAHCNFWu36vUFfGPJxYzQ1Vypi1AsQXE4HE',
      chatId: '7961446166',
      groupId: '',
      sendToGroup: false,
      enabled: true
    };
  }
  return {
    botToken: data.bot_token,
    chatId: data.chat_id,
    groupId: data.group_id,
    sendToGroup: data.send_to_group,
    enabled: data.enabled
  };
};

export const saveTelegramConfig = async (config: TelegramConfig) => {
  const { data: existing } = await supabase.from('telegram_config').select('id').single();
  
  if (existing) {
    await supabase.from('telegram_config').update({
      bot_token: config.botToken,
      chat_id: config.chatId,
      group_id: config.groupId,
      send_to_group: config.sendToGroup,
      enabled: config.enabled
    }).eq('id', existing.id);
  } else {
    await supabase.from('telegram_config').insert([{
      bot_token: config.botToken,
      chat_id: config.chatId,
      group_id: config.groupId,
      send_to_group: config.sendToGroup,
      enabled: config.enabled
    }]);
  }
};

export const sendTelegramNotification = async (order: Order): Promise<boolean> => {
  const config = await getTelegramConfig();
  
  if (!config.enabled || !config.botToken || !config.chatId) {
    return false;
  }
  
  try {
    const items = order.items.map(item => 
      `• ${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `
🛒 *NEW ORDER - DAMX STORE*

📋 *Order ID:* #${order.id}
👤 *Customer:* ${order.username}
📱 *WhatsApp:* ${order.whatsapp}
💰 *Total:* $${order.total.toFixed(2)}

📦 *Items:*
${items}

⏰ *Time:* ${new Date(order.createdAt).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}

_Review and approve in admin dashboard_
    `.trim();
    
    // Send to main chat
    await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    
    // Send receipt image if available
    if (order.paymentReceipt) {
      await fetch(`https://api.telegram.org/bot${config.botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          photo: order.paymentReceipt,
          caption: `💳 Payment Receipt for Order #${order.id}`,
        }),
      });
    }
    
    // Send to group if enabled
    if (config.sendToGroup && config.groupId) {
      await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.groupId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
      
      if (order.paymentReceipt) {
        await fetch(`https://api.telegram.org/bot${config.botToken}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: config.groupId,
            photo: order.paymentReceipt,
            caption: `💳 Payment Receipt for Order #${order.id}`,
          }),
        });
      }
    }
    
    // Mark as notified
    await supabase.from('orders').update({ telegram_notified: true }).eq('id', order.id);
    
    return true;
  } catch (error) {
    console.error('Telegram notification failed:', error);
    return false;
  }
};

// ============ STATS ============
export const getStoreStats = async (): Promise<StoreStats> => {
  const { data: orders } = await supabase.from('orders').select('total, status, order_items(quantity)').eq('status', 'approved');
  const { count: totalCustomers } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { data: feedbacks } = await supabase.from('feedbacks').select('rating').eq('visible', true);
  
  let totalSold = 0;
  let totalRevenue = 0;
  
  if (orders) {
    orders.forEach((o: any) => {
      totalRevenue += o.total;
      if (o.order_items) {
        o.order_items.forEach((i: any) => {
          totalSold += i.quantity;
        });
      }
    });
  }
  
  const averageRating = feedbacks && feedbacks.length > 0
    ? feedbacks.reduce((sum: number, f: any) => sum + f.rating, 0) / feedbacks.length
    : 5;
  
  return {
    totalSold,
    totalRevenue,
    totalCustomers: totalCustomers || 0,
    averageRating: Math.round(averageRating * 10) / 10
  };
};

// ============ ADMIN ============
export const isAdminLoggedIn = (): boolean => {
  return sessionStorage.getItem('damx_admin') === 'true';
};

export const setAdminSession = (loggedIn: boolean) => {
  sessionStorage.setItem('damx_admin', String(loggedIn));
};

export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  const { data } = await supabase.from('admin_settings').select('password').single();
  return data?.password === password;
};

export const setAdminPassword = async (password: string) => {
  const { data: existing } = await supabase.from('admin_settings').select('id').single();
  if (existing) {
    await supabase.from('admin_settings').update({ password }).eq('id', existing.id);
  } else {
    await supabase.from('admin_settings').insert([{ password }]);
  }
};

// ============ CHAT ============
export const getChatSessions = async (): Promise<ChatSession[]> => {
  const { data } = await supabase.from('chat_sessions').select('*').order('last_message_at', { ascending: false });
  return (data || []).map(d => ({
    id: d.id,
    customerId: d.customer_id,
    customerName: d.customer_name,
    customerWhatsapp: d.customer_whatsapp,
    orderId: d.order_id,
    lastMessage: d.last_message,
    lastMessageAt: d.last_message_at,
    unreadCount: d.unread_count
  }));
};

export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at');
  return (data || []).map(d => ({
    id: d.id,
    senderId: d.sender_id,
    senderName: d.sender_name,
    senderType: d.sender_type,
    receiverId: d.receiver_id,
    message: d.message,
    attachments: d.attachments,
    createdAt: d.created_at,
    read: d.read
  }));
};

export const sendChatMessage = async (
  sessionId: string,
  senderId: string,
  senderName: string,
  senderType: 'admin' | 'customer',
  message: string,
  attachments?: string[]
): Promise<ChatMessage> => {
  const { data } = await supabase.from('chat_messages').insert([{
    session_id: sessionId,
    sender_id: senderId,
    sender_name: senderName,
    sender_type: senderType,
    receiver_id: senderType === 'admin' ? sessionId : 'admin',
    message,
    attachments
  }]).select().single();
  
  // Update session
  await supabase.from('chat_sessions').update({
    last_message: message,
    last_message_at: new Date().toISOString(),
    unread_count: senderType === 'customer' ? 1 : 0
  }).eq('id', sessionId);
  
  return {
    id: data.id,
    senderId: data.sender_id,
    senderName: data.sender_name,
    senderType: data.sender_type,
    receiverId: data.receiver_id,
    message: data.message,
    attachments: data.attachments,
    createdAt: data.created_at,
    read: data.read
  };
};

export const createChatSession = async (customerId: string, customerName: string, customerWhatsapp: string): Promise<ChatSession> => {
  // Check if session exists
  const { data: existing } = await supabase.from('chat_sessions').select('*').eq('customer_id', customerId).single();
  
  if (existing) {
    return {
      id: existing.id,
      customerId: existing.customer_id,
      customerName: existing.customer_name,
      customerWhatsapp: existing.customer_whatsapp,
      orderId: existing.order_id,
      lastMessage: existing.last_message,
      lastMessageAt: existing.last_message_at,
      unreadCount: existing.unread_count
    };
  }
  
  const { data } = await supabase.from('chat_sessions').insert([{
    customer_id: customerId,
    customer_name: customerName,
    customer_whatsapp: customerWhatsapp,
    last_message: 'Welcome to DAMX STORE! How can we help you?',
    last_message_at: new Date().toISOString()
  }]).select().single();
  
  // Send welcome message
  await supabase.from('chat_messages').insert([{
    session_id: data.id,
    sender_id: 'admin',
    sender_name: 'DAMX Support',
    sender_type: 'admin',
    receiver_id: customerId,
    message: '👋 Welcome to DAMX STORE!\n\nHow can we help you today? Feel free to ask any questions about our products or your orders.',
    read: false
  }]);
  
  return {
    id: data.id,
    customerId: data.customer_id,
    customerName: data.customer_name,
    customerWhatsapp: data.customer_whatsapp,
    lastMessage: 'Welcome to DAMX STORE! How can we help you?',
    lastMessageAt: data.last_message_at,
    unreadCount: 0
  };
};

export const markChatAsRead = async (sessionId: string) => {
  await supabase.from('chat_sessions').update({ unread_count: 0 }).eq('id', sessionId);
  await supabase.from('chat_messages').update({ read: true }).eq('session_id', sessionId).eq('read', false);
};

export const getUserChatSession = async (userId: string): Promise<ChatSession | null> => {
  const { data } = await supabase.from('chat_sessions').select('*').eq('customer_id', userId).single();
  if (!data) return null;
  
  return {
    id: data.id,
    customerId: data.customer_id,
    customerName: data.customer_name,
    customerWhatsapp: data.customer_whatsapp,
    orderId: data.order_id,
    lastMessage: data.last_message,
    lastMessageAt: data.last_message_at,
    unreadCount: data.unread_count
  };
};
