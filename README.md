# DAMX STORE — Supabase Realtime Setup

## Supabase Credentials (sudah dikonfigurasi)
- **URL**: https://wopjstgdtuuwxcfvhfcx.supabase.co
- **Anon Key**: sudah dalam `src/lib/supabase.ts`

---

## LANGKAH SETUP (Wajib)

### 1. Buka Supabase SQL Editor
Pergi ke: https://supabase.com/dashboard/project/wopjstgdtuuwxcfvhfcx/sql

### 2. Jalankan Schema (jika belum)
Copy-paste kandungan `supabase-schema.sql` dan klik **Run**

### 3. Enable Realtime (WAJIB)
Copy-paste kandungan `supabase-realtime-enable.sql` dan klik **Run**

**ATAU** buat secara manual:
- Pergi ke **Database → Replication**
- Klik **supabase_realtime**
- Toggle ON untuk semua tables:
  - products, categories, orders, order_items
  - announcements, feedbacks, payment_qr
  - cart_items, chat_sessions, chat_messages
  - users, purchased_items

### 4. Install & Run
```bash
npm install
npm run dev
```

---

## Apa yang berubah

### AppContext.tsx (DIUPGRADE PENUH)
- ✅ **10 Realtime Subscriptions** — products, categories, orders, announcements, feedbacks, payment_qr, cart_items, chat_sessions, chat_messages, users
- ✅ **Auto-sync semua data** — bila admin update, semua user nampak serta-merta
- ✅ **Chat realtime** — mesej masuk tanpa refresh
- ✅ **Cleanup proper** — subscriptions dibuang bila component unmount
- ✅ **userRef tracking** — cart sync betul walaupun dalam callback

### store.ts (TIDAK DIUBAH)
- Semua queries Supabase sudah betul
- sessionStorage hanya untuk login session (normal, bukan data)

### UI/UX (TIDAK DIUBAH)
- Semua design, animasi, warna, layout kekal sama

---

## Cara Realtime Berfungsi

```
Admin tambah produk
  → Supabase simpan ke PostgreSQL
    → Supabase broadcast event ke semua subscribers
      → AppContext terima event
        → refreshProducts() dipanggil
          → Semua user nampak produk baru ✅
```

---

## Admin Login
- URL: `/admin`
- Password default: `damxadmin2024`
