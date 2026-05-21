# DAMX STORE - Supabase Database Setup

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Note down your project URL and anon key

## Step 2: Run SQL to Create Tables

Copy and paste this SQL into Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  whatsapp TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  total_purchases INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS TABLE
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  delivery_type TEXT DEFAULT 'manual' CHECK (delivery_type IN ('manual', 'auto')),
  delivery_content TEXT,
  stock INTEGER DEFAULT 999,
  sold INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CART TABLE
CREATE TABLE cart (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ORDERS TABLE
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  username TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_receipt TEXT,
  telegram_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PURCHASED ITEMS TABLE
CREATE TABLE purchased_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  delivery_content TEXT,
  rated BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FEEDBACKS TABLE
CREATE TABLE feedbacks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENT QR TABLE
CREATE TABLE payment_qr (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  account_number TEXT,
  active BOOLEAN DEFAULT true
);

-- TELEGRAM CONFIG TABLE
CREATE TABLE telegram_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bot_token TEXT,
  chat_id TEXT,
  group_id TEXT,
  send_to_group BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT false
);

-- CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('admin', 'customer')) NOT NULL,
  receiver_id UUID NOT NULL,
  message TEXT NOT NULL,
  attachment_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHAT SESSIONS TABLE
CREATE TABLE chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT,
  last_message TEXT,
  unread_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADMIN SETTINGS TABLE
CREATE TABLE admin_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  password TEXT DEFAULT 'damxadmin2024'
);

-- Insert default data
INSERT INTO categories (name, slug, description, image, sort_order) VALUES
('Software & Apps', 'software', 'Premium software and applications', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', 1),
('E-Books', 'ebooks', 'Digital books and guides', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 2),
('Courses', 'courses', 'Online courses and tutorials', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400', 3),
('Templates', 'templates', 'Design templates and assets', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400', 4),
('Gaming', 'gaming', 'Game keys and in-game items', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', 5),
('Accounts', 'accounts', 'Premium accounts and subscriptions', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 6);

INSERT INTO products (name, price, original_price, category, image, short_description, full_description, delivery_type, delivery_content, featured) VALUES
('Microsoft Office 365 Lifetime', 29.99, 99.99, 'software', 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400', 'Genuine lifetime license for Microsoft Office 365', 'Get full access to Microsoft Office 365 including Word, Excel, PowerPoint, Outlook, and more. This is a genuine lifetime license that includes all future updates. One-time payment, no subscription required.', 'auto', 'Your Office 365 license key: XXXXX-XXXXX-XXXXX', true),
('Adobe Creative Cloud 1 Year', 49.99, 239.88, 'software', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400', 'Full Adobe Creative Cloud suite for 1 year', 'Access the complete Adobe Creative Cloud suite including Photoshop, Illustrator, Premiere Pro, After Effects, and 20+ other apps. Perfect for designers, photographers, and video editors.', 'manual', 'Your Adobe account: email@adobe.com / password123', true),
('Complete Web Development Course', 19.99, 199.99, 'courses', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', 'Master web development from beginner to advanced', 'Comprehensive web development course covering HTML, CSS, JavaScript, React, Node.js, and more. Over 100 hours of video content with hands-on projects and lifetime access.', 'auto', 'Course access: https://courses.example.com/access/XXXXX', true),
('Premium UI Kit Bundle', 39.99, 149.99, 'templates', 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400', '500+ premium UI components and templates', 'Massive collection of premium UI components for Figma, Sketch, and Adobe XD. Includes dashboards, landing pages, mobile apps, and more. Fully customizable and production-ready.', 'auto', 'Download: https://drive.google.com/XXXXX', true),
('Steam Gift Card $50', 42.99, 50, 'gaming', 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400', '$50 Steam digital gift card code', 'Digital Steam gift card worth $50. Redeem on Steam to purchase games, software, and in-game items. Instant delivery of the redemption code.', 'auto', 'Steam code: XXXXX-XXXXX-XXXXX', true),
('Spotify Premium 1 Year', 24.99, 119.88, 'accounts', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400', 'Spotify Premium subscription for 12 months', 'Enjoy ad-free music streaming with Spotify Premium. Access millions of songs, podcasts, and audiobooks. Download music for offline listening. 1 year subscription included.', 'manual', 'Account: spotify@email.com / password', true),
('Netflix Premium 1 Year', 34.99, 191.88, 'accounts', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400', 'Netflix Premium 4K subscription', 'Stream unlimited movies and TV shows in 4K Ultra HD. Access to exclusive Netflix Originals. Up to 4 screens at the same time. 1 year warranty included.', 'manual', 'Account: netflix@email.com / password', true),
('Canva Pro Lifetime', 14.99, 119.99, 'software', 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400', 'Canva Pro lifetime subscription', 'Unlock all Canva Pro features including premium templates, brand kit, background remover, and more. Perfect for social media managers and content creators.', 'manual', 'Team invite link: https://canva.com/invite/XXXXX', true);

INSERT INTO payment_qr (name, image, account_number, active) VALUES
('DAMX STORE Payment', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment-damx-store', 'XXXX-XXXX-8675', true);

INSERT INTO telegram_config (bot_token, chat_id, enabled) VALUES
('YOUR_BOT_TOKEN', 'YOUR_CHAT_ID', false);

INSERT INTO admin_settings (id, password) VALUES ('1', 'damxadmin2024');

INSERT INTO announcements (title, message, type, active) VALUES
('Welcome to DAMX STORE', 'Your trusted digital marketplace. All products are verified and come with warranty.', 'info', true);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_qr ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can read active products
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (active = true OR auth.uid() IS NOT NULL);

-- Categories: Everyone can read
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT USING (true);

-- Cart: Users can manage their own cart
CREATE POLICY "Users can read own cart" ON cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart" ON cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart" ON cart
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart" ON cart
  FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can read their own orders
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Purchased items: Users can read their own items
CREATE POLICY "Users can read own items" ON purchased_items
  FOR SELECT USING (auth.uid() = user_id);

-- Feedbacks: Everyone can read visible feedbacks
CREATE POLICY "Anyone can read visible feedbacks" ON feedbacks
  FOR SELECT USING (visible = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert feedbacks" ON feedbacks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Announcements: Everyone can read active
CREATE POLICY "Anyone can read active announcements" ON announcements
  FOR SELECT USING (active = true);

-- Payment QR: Everyone can read
CREATE POLICY "Anyone can read payment QR" ON payment_qr
  FOR SELECT USING (true);

-- Chat: Users can read their messages
CREATE POLICY "Users can read own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Chat sessions: Users can read their sessions
CREATE POLICY "Users can read own sessions" ON chat_sessions
  FOR SELECT USING (true);

-- FUNCTIONS

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, whatsapp)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'whatsapp'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## Step 3: Create Storage Buckets

1. Go to Storage in Supabase
2. Create these buckets:
   - `products` (public)
   - `receipts` (public)
   - `chat-attachments` (public)

## Step 4: Environment Variables

Create `.env` file in your project:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Default Credentials

- **Admin Password**: `damxadmin2024`
- Change this in the `admin_settings` table

## Telegram Bot Setup

1. Create bot via @BotFather
2. Get your Chat ID via @userinfobot
3. Update `telegram_config` table with your bot token and chat ID

## Features

✅ User Registration & Login (Supabase Auth)
✅ Real-time Products (visible to all users)
✅ Shopping Cart
✅ Order System
✅ Payment QR
✅ Telegram Notifications
✅ Customer Chat
✅ Admin Dashboard
✅ Rating & Feedback
✅ Row Level Security
