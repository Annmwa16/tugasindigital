-- ============================================================
--  TUGASIN DIGITAL — Supabase Database Schema
--  Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. ENUM-like domain values (gunakan TEXT + constraint)

-- 2. TABEL: services
CREATE TABLE IF NOT EXISTS public.services (
  id           SERIAL PRIMARY KEY,
  service_name TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'Uncategorized',
  pillar       TEXT NOT NULL CHECK (pillar IN ('face','brain','backbone')),
  description  TEXT,
  price_min    INTEGER NOT NULL DEFAULT 0,
  price_max    INTEGER NOT NULL DEFAULT 0,
  icon         TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id             SERIAL PRIMARY KEY,
  order_id       TEXT NOT NULL UNIQUE,
  customer_name  TEXT NOT NULL,
  whatsapp       TEXT NOT NULL,
  service_name   TEXT NOT NULL,
  detail_request TEXT,
  deadline       TEXT,
  price          INTEGER,
  status         TEXT NOT NULL DEFAULT 'Baru'
                   CHECK (status IN ('Baru','Proses','Pelunasan','Selesai','Revisi','Dibatalkan')),
  payment_status TEXT NOT NULL DEFAULT 'Belum Bayar'
                   CHECK (payment_status IN ('Belum Bayar','DP 50%','Lunas')),
  file_urls      TEXT,
  result_files   TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. TABEL: testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  role         TEXT,
  content      TEXT NOT NULL,
  rating       INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  foto_url     TEXT,
  service_name TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABEL: portofolio
CREATE TABLE IF NOT EXISTS public.portofolio (
  id          SERIAL PRIMARY KEY,
  judul       TEXT NOT NULL,
  kategori    TEXT NOT NULL,
  deskripsi   TEXT,
  foto_url    TEXT,
  published   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABEL: posts (Blog)
CREATE TABLE IF NOT EXISTS public.posts (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  category     TEXT NOT NULL DEFAULT 'Growth',
  content      TEXT NOT NULL,
  excerpt      TEXT,
  read_time    TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portofolio   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts        ENABLE ROW LEVEL SECURITY;

-- orders: public bisa INSERT & SELECT by order_id, admin bisa ALL
CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_public_select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_admin_update"  ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "orders_admin_delete"  ON public.orders FOR DELETE USING (auth.role() = 'authenticated');

-- services: semua bisa baca, admin bisa kelola
CREATE POLICY "services_public_select" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "services_admin_all"     ON public.services FOR ALL    USING (auth.role() = 'authenticated');

-- testimonials: publik baca yang published, admin kelola semua
CREATE POLICY "testi_public_select" ON public.testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "testi_admin_all"     ON public.testimonials FOR ALL    USING (auth.role() = 'authenticated');

-- portofolio: publik baca yang published
CREATE POLICY "porto_public_select" ON public.portofolio FOR SELECT USING (published = true);

-- posts: publik baca yang published, admin kelola semua
CREATE POLICY "posts_public_select" ON public.posts FOR SELECT USING (is_published = true);
CREATE POLICY "posts_admin_all"     ON public.posts FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "porto_admin_all"     ON public.portofolio FOR ALL    USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET: order-files
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-files', 'order-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "order_files_public_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'order-files');
CREATE POLICY "order_files_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'order-files');
CREATE POLICY "order_files_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'order-files' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA: services
-- ============================================================
INSERT INTO public.services (service_name, category, pillar, price_min, price_max, icon, is_active) VALUES
  ('UI/UX Design Modern',          'Creative & Visual', 'face',     150000,  800000, '🎨', true),
  ('UI/UX Design Pixel Art',       'Creative & Visual', 'face',     100000,  500000, '🕹️', true),
  ('Social Media Management',      'Creative & Visual', 'face',     200000, 1500000, '📱', true),
  ('Branding Kit Lengkap',         'Creative & Visual', 'face',     300000, 2000000, '🎯', true),
  ('Pitch Deck & Presentasi',      'Creative & Visual', 'face',     100000,  600000, '📊', true),
  ('UGC Agency',                   'Creative & Visual', 'face',     300000, 2000000, '🎬', true),
  ('Personal Branding Architect',  'Growth & Social',   'brain',    250000, 1000000, '👤', true),
  ('Engagement Booster',           'Growth & Social',   'brain',    150000,  500000, '📈', true),
  ('Digital Legacy — Aetheris',    'Growth & Social',   'brain',    500000, 5000000, '🏫', true),
  ('Digital Asset & Security',     'Technical',         'backbone', 200000, 1000000, '🔒', true),
  ('Web Maintenance & SEO',        'Technical',         'backbone', 180000, 1500000, '⚡', true),
  ('AI Research & Data Scraping',  'Technical',         'backbone', 300000, 2000000, '🤖', true),
  ('Virtual Assistant Pro',        'Technical',         'backbone', 350000, 3000000, '🗂️', true),
  ('Custom / Lainnya',             'Custom',            'backbone',      0,       0, '✨', true)
ON CONFLICT DO NOTHING;

-- SEED DATA: testimonials
INSERT INTO public.testimonials (name, role, content, rating, service_name, is_published) VALUES
  ('Bintang Perkasa',  'Founder, Nusantara Kreatif',  'Tugasin Digital mengubah cara kami beroperasi secara digital. Desain UI/UX mereka fungsional sekaligus memukau.', 5, 'UI/UX Design Modern',        true),
  ('Maharani Putri',   'CEO, Toko Mawar Online',       'Followers IG kami naik 3x dalam 2 bulan. Konten Service, strategi hashtag sangat terukur. Tim super responsif!',   5, 'Social Media Management',    true),
  ('Rizky Aditya',     'Mahasiswa S2 Teknik',          'Pitch deck sidang tesis dikerjakan 24 jam, kualitas melebihi ekspektasi. Tim penguji sangat terkesan.',           5, 'Pitch Deck & Presentasi',    true),
  ('Dewi Sartika',     'Brand Manager, UMKM Lokal',    'AI Research mereka memberi insight kompetitor yang sangat berharga. Data akurat dan terstruktur.',                 5, 'AI Research & Data Scraping',true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- INDEKS untuk performa query
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_order_id  ON public.orders (order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status    ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp  ON public.orders (whatsapp);
CREATE INDEX IF NOT EXISTS idx_orders_created   ON public.orders (created_at DESC);

-- ============================================================
-- SELESAI!
-- ============================================================
