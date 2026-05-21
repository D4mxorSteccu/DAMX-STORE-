export interface User {
  id: string;
  username: string;
  password: string;
  whatsapp: string;
  createdAt: string;
  totalPurchases: number;
  totalSpent: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  deliveryType: 'manual' | 'auto';
  deliveryContent?: string;
  deliveryFiles?: string[];
  stock: number;
  sold: number;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  username: string;
  whatsapp: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentReceipt?: string;
  createdAt: string;
  updatedAt: string;
  telegramNotified?: boolean;
  deliveredViaChat?: boolean;
}

export interface PurchasedItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  userId: string;
  deliveryContent?: string;
  deliveryFiles?: string[];
  purchasedAt: string;
  rated: boolean;
}

export interface Feedback {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
  visible: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: string;
}

export interface PaymentQR {
  id: string;
  image: string;
  name: string;
  accountNumber?: string;
  active: boolean;
}

export interface StoreStats {
  totalSold: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  groupId?: string;
  sendToGroup: boolean;
  enabled: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'admin' | 'customer';
  receiverId: string;
  message: string;
  attachments?: string[];
  orderId?: string;
  orderDetails?: {
    orderId: string;
    items: string[];
    total: number;
  };
  createdAt: string;
  read: boolean;
}

export interface ChatSession {
  id: string;
  customerId: string;
  customerName: string;
  customerWhatsapp: string;
  orderId?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}
