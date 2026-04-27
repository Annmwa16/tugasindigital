# 🏛️ Tugasin Digital — Next.js Service Agency Website

Stack: **Next.js 14 (App Router)** · **Tailwind CSS** · **Supabase** · **Framer Motion**

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy dan isi environment variables
cp .env.local.example .env.local

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Setup Supabase

### 1. Jalankan SQL Schema
Buka **Supabase Dashboard → SQL Editor**, paste isi file `supabase-schema.sql` dan klik **Run**.

Schema ini otomatis membuat:
- Tabel `orders`, `services`, `testimonials`, `portofolio`
- Row Level Security (RLS) policies
- Storage bucket `order-files`
- Seed data layanan & testimoni awal
- Index untuk performa query

### 2. Buat Admin User
Di Supabase Dashboard → **Authentication → Users → Invite User**:
- Email: `admin@tugasindigital.com`
- Atau gunakan email Anda sendiri

### 3. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_WA_NUMBER=628xxxxxxxxxxxx
NEXT_PUBLIC_GOOGLE_SHEET_SCRIPT=https://script.google.com/...
```

---

## 📁 Struktur Project

```
tugasindigital-next/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page utama
│   │   ├── layout.tsx        # Root layout (Navbar + Footer)
│   │   ├── globals.css       # Design system + Tailwind
│   │   ├── order/page.tsx    # Form order + kalkulator
│   │   ├── track/page.tsx    # Status tracking real-time
│   │   ├── client/page.tsx   # Portal klien
│   │   └── admin/page.tsx    # Dashboard admin (auth protected)
│   ├── components/
│   │   ├── Navbar.tsx        # Responsive navbar dengan glass effect
│   │   ├── Footer.tsx        # Footer dengan link & WA CTA
│   │   ├── Hero.tsx          # Hero section dengan particle canvas
│   │   ├── Pillars.tsx       # 3 Pilar layanan dengan filter dinamis
│   │   ├── TestimonialSlider.tsx  # Auto-sliding testimonials
│   │   ├── OrderForm.tsx     # Form order lengkap + kalkulator harga
│   │   └── TrackOrder.tsx    # Progress bar tracking visual
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts          # Helper functions
│   └── types/
│       └── database.ts       # TypeScript types
├── supabase-schema.sql       # 🔑 Jalankan ini di Supabase SQL Editor
├── .env.local                # API Keys (jangan commit ke git!)
├── tailwind.config.ts        # Brand colors: Navy, Gold, Platinum
└── package.json
```

---

## 🎨 Brand Design System

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#1A2540` | Background utama, teks primer |
| `gold` | `#F4B41A` | CTA, aksen, highlight |
| `platinum` | `#E5E4E2` | Border, background subtle |

---

## 📄 Halaman & Fitur

| Route | Deskripsi |
|-------|-----------|
| `/` | Landing page: Hero, 11 Layanan (3 Pilar), Testimonial slider, CTA |
| `/order` | Form order Service + kalkulator estimasi harga otomatis |
| `/track` | Tracking real-time dengan visual progress bar 4 tahap |
| `/client` | Portal klien — lihat semua order via nomor WA |
| `/admin` | Dashboard admin — CRUD orders, stats, edit status & harga |

---

## 🔐 Keamanan

- Auth menggunakan **Supabase Auth** (JWT)
- **Row Level Security** aktif di semua tabel
- Klien hanya bisa insert & select order milik sendiri
- Admin (authenticated) bisa update/delete semua data
- API keys disimpan di `.env.local` (tidak di-commit)

---

## 📦 Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env variables di Vercel Dashboard
# Project Settings → Environment Variables
```

---

## 📱 WhatsApp Integration

Order form otomatis generate pesan WA terstruktur:
```
━━━━━━━━━━━━━━━━━━━━
KONFIRMASI ORDER — TUGASIN DIGITAL
━━━━━━━━━━━━━━━━━━━━
ID Order  : TD-20250425-AB12
Nama      : John Doe
Layanan   : UI/UX Design Modern
Deadline  : 30 April 2025
Budget    : Rp 250.000

Detail: [deskripsi kebutuhan]
```

---

*Built with ❤️ untuk Tugasin Digital*
