'use client'

const SERVICES = [
  { label: 'UI/UX Design', icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
  { label: 'Web Development', icon: 'M16 18l6-6-6-6M8 6l-6 6 6 6' },
  { label: 'Social Media', icon: 'M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 11.45 8a12.82 12.82 0 0 1-9.29-4.71 4.52 4.52 0 0 0 1.4 6.02A4.4 4.4 0 0 1 1 9v.05a4.52 4.52 0 0 0 3.62 4.43 4.5 4.5 0 0 1-2 .08 4.52 4.52 0 0 0 4.22 3.14A9.07 9.07 0 0 1 1 18.4a12.82 12.82 0 0 0 6.94 2.03c8.34 0 12.9-6.9 12.9-12.89 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z' },
  { label: 'Branding Kit', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
  { label: 'SEO Optimization', icon: 'M21 21l-4.35-4.35M11 19A8 8 0 1 0 11 3a8 8 0 0 0 0 16z' },
  { label: 'AI Research', icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18' },
  { label: 'Personal Branding', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { label: 'Pitch Deck', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { label: 'Virtual Assistant', icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
  { label: 'UGC Agency', icon: 'M15 10l4.553-2.069A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z' },
  { label: 'Bantuan Tugas Akademik', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
  { label: 'Digital Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
]

// Duplicate for seamless loop
const ITEMS = [...SERVICES, ...SERVICES]

export default function ServiceMarquee() {
  return (
    <div className="bg-gold py-4 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gold to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gold to-transparent z-10 pointer-events-none" />

      <div
        className="flex items-center gap-0 whitespace-nowrap"
        style={{ animation: 'marquee 30s linear infinite' }}
      >
        {ITEMS.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 text-navy font-semibold text-sm px-6">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50 flex-shrink-0">
              <path d={s.icon} />
            </svg>
            {s.label}
            <span className="w-1 h-1 bg-navy/20 rounded-full ml-2" />
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
