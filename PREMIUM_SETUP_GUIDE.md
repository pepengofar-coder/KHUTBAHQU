# Panduan Setup Premium (SaaS Subscription)

Panduan ini menjelaskan cara mengkonfigurasi backend Supabase dan Payment Gateway untuk sistem Premium Islamediaku.

## 1. Environment Variables (.env)
Buat file `.env` (atau `.env.local` untuk development) di root proyek Anda, lalu isi variabel-variabel berikut.

### Supabase
Dapatkan URL dan KEY ini dari Dashboard Supabase > **Project Settings** > **API**.
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
```
*(Catatan: Meskipun prefix-nya `NEXT_PUBLIC_`, Vite akan membacanya jika di-alias atau diubah menjadi `VITE_` jika menggunakan frontend saja. Tapi karena kita memakai Vercel Serverless Functions di folder `/api`, Vercel membutuhkan environment variables ini diset langsung di dashboard Vercel).*

**PENTING UNTUK VITE:**
Untuk frontend Vite, buat juga variabel dengan prefix `VITE_` di file `.env`:
```env
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```

### Mock Payment (Development)
Untuk menguji flow tanpa payment asli.
```env
ENABLE_MOCK_PAYMENT=true
```

## 2. Setup Database Supabase (SQL Script)
Buka Dashboard Supabase > **SQL Editor**, dan jalankan query berikut untuk membuat tabel dan keamanan (RLS).

```sql
-- 1. Create Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_provider TEXT,
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  provider TEXT,
  provider_payment_id TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'IDR',
  status TEXT,
  raw_event JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat langganannya sendiri
CREATE POLICY "Users can view own subscriptions" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- User hanya bisa melihat pembayarannya sendiri
CREATE POLICY "Users can view own payments" 
ON payments FOR SELECT 
USING (auth.uid() = user_id);

-- Hanya Service Role (Backend API) yang bisa Insert/Update
CREATE POLICY "Service role can manage all subscriptions"
ON subscriptions FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all payments"
ON payments FOR ALL
USING (auth.role() = 'service_role');
```

## 3. Setup Vercel (Production)
Aplikasi ini menggunakan Vercel Serverless Functions di folder `api/`.
1. Masuk ke dashboard Vercel proyek Anda.
2. Ke menu **Settings > Environment Variables**.
3. Tambahkan semua variabel dari file `.env.example`.
4. Pastikan `ENABLE_MOCK_PAYMENT=false` di Production jika Anda sudah siap menggunakan payment gateway asli.

## 4. Keamanan
- `SUPABASE_SERVICE_ROLE_KEY` memiliki izin **bypass RLS** (bisa menghapus/mengubah semua data). Kunci ini **HANYA** boleh diletakkan di environment variables Vercel dan digunakan di dalam folder `api/` (backend).
- **JANGAN PERNAH** menambahkan prefix `VITE_` atau `NEXT_PUBLIC_` pada `SUPABASE_SERVICE_ROLE_KEY`.

## 5. Deployment Checklist
- [ ] Database tabel sudah dibuat di Supabase.
- [ ] RLS Policy sudah aktif.
- [ ] `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` terpasang di Vercel.
- [ ] Vercel berhasil melakukan build tanpa error.
- [ ] Registrasi & Login berfungsi.
- [ ] Uji coba checkout Mock menghasilkan status 'Active'.
