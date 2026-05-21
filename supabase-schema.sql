-- DAMX STORE Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  total_purchases INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(255) NOT NULL,
  image TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  delivery_type VARCHAR(50) DEFAULT 'auto',
  delivery_content TEXT,
  delivery_files TEXT[],
  stock INTEGER DEFAULT 999,
  sold INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  username VARCHAR(255),
  whatsapp VARCHAR(50),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_receipt TEXT,
  telegram_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  product_image TEXT,
  price DECIMAL(10,2),
  quantity INTEGER DEFAULT 1
);

-- Purchased items table
CREATE TABLE IF NOT EXISTS purchased_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  delivery_content TEXT,
  delivery_files TEXT[],
  rated BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  username VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment QR table
CREATE TABLE IF NOT EXISTS payment_qr (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255),
  image TEXT,
  account_number VARCHAR(100),
  active BOOLEAN DEFAULT true
);

-- Telegram config table
CREATE TABLE IF NOT EXISTS telegram_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bot_token TEXT,
  chat_id VARCHAR(100),
  group_id VARCHAR(100),
  send_to_group BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT false
);

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_name VARCHAR(255),
  customer_whatsapp VARCHAR(50),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_id UUID,
  sender_name VARCHAR(255),
  sender_type VARCHAR(50) CHECK (sender_type IN ('admin', 'customer')),
  message TEXT NOT NULL,
  attachments TEXT[],
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  password VARCHAR(255) DEFAULT 'damxadmin2024'
);

-- Insert default data

-- Insert default categories
INSERT INTO categories (name, slug, description, image) VALUES
('Software & Apps', 'software', 'Premium software and applications', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'),
('E-Books', 'ebooks', 'Digital books and guides', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'),
('Courses', 'courses', 'Online courses and tutorials', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400'),
('Templates', 'templates', 'Design templates and assets', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400'),
('Gaming', 'gaming', 'Game keys and in-game items', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400'),
('Accounts', 'accounts', 'Premium accounts and subscriptions', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400')
ON CONFLICT (slug) DO NOTHING;

-- Insert default products
INSERT INTO products (name, price, original_price, category, image, short_description, full_description, delivery_type, delivery_content, stock, sold, featured) VALUES
('Microsoft Office 365 Lifetime', 29.99, 99.99, 'software', 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400', 'Genuine lifetime license for Microsoft Office 365', 'Get full access to Microsoft Office 365 including Word, Excel, PowerPoint, Outlook, and more.', 'auto', 'Your Office 365 license key will be delivered automatically.', 999, 0, true),
('Adobe Creative Cloud 1 Year', 49.99, 239.88, 'software', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400', 'Full Adobe Creative Cloud suite for 1 year', 'Access the complete Adobe Creative Cloud suite including Photoshop, Illustrator, Premiere Pro.', 'manual', 'Your Adobe account credentials will be delivered within 24 hours.', 50, 0, true),
('Complete Web Development Course', 19.99, 199.99, 'courses', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', 'Master web development from beginner to advanced', 'Comprehensive web development course covering HTML, CSS, JavaScript, React, Node.js.', 'auto', 'Course access link will be provided instantly.', 999, 0, true),
('Premium UI Kit Bundle', 39.99, 149.99, 'templates', 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400', '500+ premium UI components and templates', 'Massive collection of premium UI components for Figma, Sketch, and Adobe XD.', 'auto', 'Download link will be provided instantly.', 999, 0, true),
('Steam Gift Card $50', 42.99, 50, 'gaming', 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400', '$50 Steam digital gift card code', 'Digital Steam gift card worth $50. Redeem on Steam to purchase games.', 'auto', 'Steam gift card code will be delivered instantly.', 200, 0, true),
('Spotify Premium 1 Year', 24.99, 119.88, 'accounts', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400', 'Spotify Premium subscription for 12 months', 'Enjoy ad-free music streaming with Spotify Premium.', 'manual', 'Account credentials will be delivered within 12 hours.', 100, 0, true),
('Netflix Premium 1 Year', 34.99, 191.88, 'accounts', 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400', 'Netflix Premium 4K subscription', 'Stream unlimited movies and TV shows in 4K Ultra HD.', 'manual', 'Account credentials will be delivered within 24 hours.', 75, 0, true),
('Canva Pro Lifetime', 14.99, 119.99, 'software', 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400', 'Canva Pro lifetime subscription', 'Unlock all Canva Pro features including premium templates.', 'manual', 'Team invite link will be sent within 24 hours.', 150, 0, true),
('ChatGPT Plus 1 Month', 12.99, 20, 'accounts', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400', 'ChatGPT Plus subscription with GPT-4 access', 'Access ChatGPT Plus with GPT-4 capabilities.', 'manual', 'Account credentials will be delivered within 12 hours.', 80, 0, true),
('Digital Marketing Mastery', 29.99, 299.99, 'courses', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'Complete digital marketing course', 'Master digital marketing including SEO, social media marketing.', 'auto', 'Course access credentials will be provided instantly.', 999, 0, false),
('Python Programming E-Book', 9.99, 29.99, 'ebooks', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', 'Complete Python programming guide', 'Learn Python from scratch with this comprehensive e-book.', 'auto', 'PDF download link will be provided instantly.', 999, 0, false),
('WordPress Theme Bundle', 59.99, 299.99, 'templates', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400', '50+ premium WordPress themes', 'Collection of 50+ premium WordPress themes for various niches.', 'auto', 'Download links for all themes will be provided instantly.', 999, 0, false)
ON CONFLICT DO NOTHING;

-- Insert default payment QR
INSERT INTO payment_qr (name, image, account_number, active) VALUES
('DAMX STORE Payment', 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=payment-damx-store', 'XXXX-XXXX-8675', true)
ON CONFLICT DO NOTHING;

-- Insert default telegram config
INSERT INTO telegram_config (bot_token, chat_id, group_id, send_to_group, enabled) VALUES
('8543897669:AAHCNFWu36vUFfGPJxYzQ1Vypi1AsQXE4HE', '7961446166', '', false, true)
ON CONFLICT DO NOTHING;

-- Insert default admin settings
INSERT INTO admin_settings (password) VALUES ('damxadmin2024')
ON CONFLICT DO NOTHING;

-- Insert default announcement
INSERT INTO announcements (title, message, type, active) VALUES
('Welcome to DAMX STORE', 'Your trusted digital marketplace. All products are verified and come with warranty.', 'info', true)
ON CONFLICT DO NOTHING;

-- Create Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products and categories
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public can view payment_qr" ON payment_qr FOR SELECT USING (true);

-- Allow all operations for now (simplified for demo)
CREATE POLICY "Enable all for users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all for cart_items" ON cart_items FOR ALL USING (true);
CREATE POLICY "Enable all for orders" ON orders FOR ALL USING (true);
CREATE POLICY "Enable all for order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Enable all for purchased_items" ON purchased_items FOR ALL USING (true);
CREATE POLICY "Enable all for feedbacks" ON feedbacks FOR ALL USING (true);
CREATE POLICY "Enable all for chat_sessions" ON chat_sessions FOR ALL USING (true);
CREATE POLICY "Enable all for chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Enable all for telegram_config" ON telegram_config FOR ALL USING (true);
CREATE POLICY "Enable all for admin_settings" ON admin_settings FOR ALL USING (true);
CREATE POLICY "Enable all for payment_qr" ON payment_qr FOR ALL USING (true);
CREATE POLICY "Enable all for products" ON products FOR ALL USING (true);
CREATE POLICY "Enable all for categories" ON categories FOR ALL USING (true);
CREATE POLICY "Enable all for announcements" ON announcements FOR ALL USING (true);
