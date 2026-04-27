'use client'

import { useState } from 'react'
import Link from 'next/link'

type PillarKey = 'all' | 'creative' | 'growth' | 'enterprise' | 'academic'

const PILLARS: { key: PillarKey; label: string; subtitle: string; accent: string }[] = [
  { key: 'all',        label: 'Semua',          subtitle: '',                          accent: 'border-navy/20' },
  { key: 'creative',   label: 'Creative',        subtitle: 'UI, Design & Branding',    accent: 'border-rose-300' },
  { key: 'growth',     label: 'Growth',          subtitle: 'Social Media & Marketing', accent: 'border-amber-300' },
  { key: 'enterprise', label: 'Enterprise',      subtitle: 'Sistem & Infrastruktur',   accent: 'border-cyan-300' },
  { key: 'academic',   label: 'Bantuan Tugas Akademik',      subtitle: 'Akademik & Riset',         accent: 'border-purple-300' },
]

const SERVICES = [
  { pillar: 'creative' as PillarKey,   icon: <DesignIcon />,     title: 'UI/UX Design',             subtitle: 'Web & Mobile Interface',  desc: 'Desain antarmuka clean & minimalis untuk web, aplikasi, dan dashboard profesional.', price: 'Rp 150rb+', tags: ['Figma', 'Responsive', 'Prototype'] },
  { pillar: 'creative' as PillarKey,   icon: <BrushIcon />,      title: 'Branding Kit',             subtitle: 'Visual Identity System',  desc: 'Logo, color palette, typography, dan brand guideline untuk tampilan yang konsisten.', price: 'Rp 200rb+', tags: ['Logo', 'Brand Guide', 'Assets'] },
  { pillar: 'creative' as PillarKey,   icon: <SlideIcon />,      title: 'Pitch Deck & PPT',         subtitle: 'Storytelling Visual',     desc: 'Slide presentasi berbasis storytelling untuk sidang, investor pitch, atau company profile.', price: 'Rp 100rb+', tags: ['PowerPoint', 'Canva', 'Print'] },
  { pillar: 'creative' as PillarKey,   icon: <VideoIcon />,      title: 'UGC Agency',               subtitle: 'User Generated Content',  desc: 'Konten video review produk autentik dari talent terpilih — lebih dipercaya dari iklan biasa.', price: 'Rp 300rb+', tags: ['Video', 'TikTok', 'Review'] },
  { pillar: 'growth' as PillarKey,     icon: <SocialIcon />,     title: 'Social Media Management', subtitle: 'IG, TikTok & LinkedIn',   desc: 'Pengelolaan konten, template Canva, riset hashtag, AR Filter, dan scheduling terstruktur.', price: 'Rp 200rb+', tags: ['Instagram', 'TikTok', 'Canva'] },
  { pillar: 'growth' as PillarKey,     icon: <PersonIcon />,     title: 'Personal Branding',        subtitle: 'LinkedIn & Instagram',    desc: 'Optimasi profil profesional dan ghostwriting konten agar Anda tampil sebagai thought leader.', price: 'Rp 250rb+', tags: ['LinkedIn', 'Ghostwriting', 'SEO'] },
  { pillar: 'growth' as PillarKey,     icon: <TrendIcon />,      title: 'Engagement Booster',       subtitle: 'Social Proof & Reach',    desc: 'Strategi peningkatan kredibilitas sosial yang terukur untuk membangun kepercayaan audiens.', price: 'Rp 150rb+', tags: ['Engagement', 'Growth', 'Analytics'] },
  { pillar: 'growth' as PillarKey,     icon: <SchoolIcon />,     title: 'Digital Legacy',           subtitle: 'Aetheris Method',         desc: 'Branding eksklusif untuk institusi pendidikan: web angkatan, yearbook digital, event system.', price: 'Rp 500rb+', tags: ['Education', 'Web', 'Yearbook'] },
  { pillar: 'enterprise' as PillarKey, icon: <ShieldIcon />,     title: 'Digital Asset Security',   subtitle: 'Cloud & Infrastructure',  desc: 'Pengamanan email & data bisnis, migrasi Cloud, dan setup sistem kerja tim yang efisien.', price: 'Rp 200rb+', tags: ['Security', 'Cloud', 'Backup'] },
  { pillar: 'enterprise' as PillarKey, icon: <SpeedIcon />,      title: 'Web Maintenance & SEO',    subtitle: 'Optimasi & Growth',       desc: 'Perawatan web pasca-rilis, optimasi kecepatan, dan strategi SEO untuk halaman pertama Google.', price: 'Rp 180rb+', tags: ['SEO', 'Speed', 'Google'] },
  { pillar: 'enterprise' as PillarKey, icon: <BotIcon />,        title: 'AI Research & Scraping',   subtitle: 'Otomasi & Analitik',      desc: 'Pengumpulan data massal otomatis menggunakan AI untuk riset pasar dan kompetitor analysis.', price: 'Rp 300rb+', tags: ['AI', 'Data', 'Python'] },
  { pillar: 'enterprise' as PillarKey, icon: <AssistantIcon />,  title: 'Virtual Assistant Pro',    subtitle: 'Remote Administrative',   desc: 'Asisten jarak jauh untuk jadwal, invoicing, email management, dan tugas administratif.', price: 'Rp 350rb+', tags: ['Admin', 'Email', 'Schedule'] },
  { pillar: 'academic' as PillarKey,   icon: <PenIcon />,        title: 'Makalah & Essay',     subtitle: 'Akademik Terstruktur',    desc: 'Penulisan makalah, essay, dan laporan akademik dengan referensi valid dan format tepat.', price: 'Rp 50rb+', tags: ['Makalah', 'Essay', 'APA'] },
  { pillar: 'academic' as PillarKey,   icon: <CodeIcon />,       title: 'Coding & Tugas',      subtitle: 'Programming Assignment',  desc: 'Penyelesaian tugas coding (Python, JS, PHP, SQL) dan proyek pemrograman kampus.', price: 'Rp 75rb+', tags: ['Python', 'JavaScript', 'PHP'] },
  { pillar: 'academic' as PillarKey,   icon: <ChartIcon />,      title: 'Riset & Analisis Data',    subtitle: 'Statistik & SPSS',        desc: 'Pengolahan data SPSS, interpretasi hasil uji, dan penyusunan bab hasil penelitian.', price: 'Rp 100rb+', tags: ['SPSS', 'Statistik', 'Laporan'] },
]

// Inline SVG icons (Lucide-style)
function DesignIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg> }
function BrushIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.48 1.94 4 2.02 2.2 0 4-1.9 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg> }
function SlideIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> }
function VideoIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> }
function SocialIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> }
function PersonIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function TrendIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> }
function SchoolIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2.21 2.686 4 6 4s6-1.79 6-4v-5"/></svg> }
function ShieldIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function SpeedIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> }
function BotIcon()       { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="8" width="20" height="12" rx="2"/><path d="M12 2v6M8 2h8"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/><path d="M7 18h10"/></svg> }
function AssistantIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> }
function PenIcon()       { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> }
function CodeIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> }
function ChartIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }

const PILLAR_ACCENT: Record<PillarKey, string> = {
  all:        'text-navy/40',
  creative:   'text-rose-500',
  growth:     'text-amber-500',
  enterprise: 'text-cyan-500',
  academic:   'text-purple-500',
}

const PILLAR_ICON_BG: Record<PillarKey, string> = {
  all:        'bg-navy/5 group-hover:bg-navy/10',
  creative:   'bg-rose-50 group-hover:bg-rose-100',
  growth:     'bg-amber-50 group-hover:bg-amber-100',
  enterprise: 'bg-cyan-50 group-hover:bg-cyan-100',
  academic:   'bg-purple-50 group-hover:bg-purple-100',
}

export default function Pillars() {
  const [active, setActive] = useState<PillarKey>('all')
  const filtered = active === 'all' ? SERVICES : SERVICES.filter(s => s.pillar === active)

  return (
    <section id="layanan" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label mb-5">Empat Pilar Keahlian</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy mb-4">
            Solusi Digital
            <span className="block italic text-shimmer">Lengkap</span>
          </h2>
          <p className="text-navy/50 text-base max-w-xl mx-auto">
            Dari desain visual hingga infrastruktur teknis — dan juga Membantu Tugas akademik. Satu tim, semua kebutuhan.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {PILLARS.map(p => (
            <button
              key={p.key}
              onClick={() => setActive(p.key)}
              className={`flex flex-col items-center px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                active === p.key
                  ? 'bg-navy text-white border-navy shadow-luxury'
                  : 'bg-white text-navy/60 border-navy/12 hover:border-navy/30 hover:text-navy'
              }`}
            >
              <span>{p.label}</span>
              {p.subtitle && <span className={`text-[10px] font-normal mt-0.5 ${active === p.key ? 'text-white/60' : 'text-navy/35'}`}>{p.subtitle}</span>}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((svc, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-platinum/60 hover:border-navy/15 hover:shadow-luxury p-6 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${PILLAR_ICON_BG[svc.pillar]} ${PILLAR_ACCENT[svc.pillar]}`}>
                  {svc.icon}
                </div>
                <span className="text-xs font-semibold text-gold bg-gold/8 px-2.5 py-1 rounded-full">{svc.price}</span>
              </div>
              <h3 className="font-semibold text-navy text-base mb-0.5">{svc.title}</h3>
              <p className={`text-xs font-medium mb-3 ${PILLAR_ACCENT[svc.pillar]}`}>{svc.subtitle}</p>
              <p className="text-navy/55 text-sm leading-relaxed mb-4 break-words">{svc.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {svc.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-navy/4 text-navy/45 text-[11px] font-medium rounded-md">{t}</span>
                ))}
              </div>
              <Link
                href={`/order?service=${encodeURIComponent(svc.title)}`}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-navy/15 text-navy/65 text-sm font-medium rounded-xl hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 group-hover:border-navy/30"
              >
                Pesan Layanan
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-navy/35 text-sm mb-4">Ada kebutuhan di luar daftar ini?</p>
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '6289540108751'}?text=Halo!%20Saya%20punya%20kebutuhan%20digital%20yang%20ingin%20didiskusikan.`}
            target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
            Diskusikan Kebutuhan Custom
          </a>
        </div>
      </div>
    </section>
  )
}
