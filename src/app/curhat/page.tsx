import FloatingWA from '@/components/FloatingWA'

const WA = process.env.NEXT_PUBLIC_WA_NUMBER || '6289540108751'

export const metadata = { title: 'Curhat Digital | Tugasin Digital' }

const TOPICS = [
  { title: 'Arah Karir Digital', desc: 'Bingung mau jadi apa? Kami bantu peta jalan realistis untuk dunia digital.' },
  { title: 'Personal Branding', desc: 'Merasa tidak punya daya jual? Kami bantu temukan keunikan dan cara menampilkannya.' },
  { title: 'Validasi Ide Bisnis', desc: 'Punya ide tapi ragu? Diskusikan market fit, diferensiasi, dan langkah awal.' },
  { title: 'Strategi Digital', desc: 'Bingung mulai dari mana? Kami bantu susun strategi hadir di digital step-by-step.' },
  { title: 'Dilema Akademik', desc: 'Skripsi stuck, overthinking soal nilai? Curhat dulu, kami bantu cari solusi.' },
  { title: 'Apapun yang Mengganjal', desc: 'Tidak harus digital. Kalau ada yang bikin pikiran penuh, kami siap dengerin.' },
]

export default function CurhatPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#1A2540 0%,#2D1B4E 55%,#1A2540 100%)" }}>
      <div className="pt-32 pb-24 px-5 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-400/10 border border-purple-400/20 rounded-full text-purple-300 text-xs font-semibold tracking-widest uppercase mb-8">
            Safe Space Digital
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
            Bingung? Stres?
            <span className="block font-semibold italic" style={{ color: "#C084FC" }}>Cerita ke Kami</span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Kami bukan psikolog, tapi kami pendengar yang baik. Bingung soal karir, personal branding, atau sekadar mau nDP 50%in ide? Kami siap dengerin.
          </p>
          <a href={"https://wa.me/" + WA + "?text=Halo!%20Saya%20mau%20curhat%20digital%20nih.%20Boleh?"}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-base transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#9333EA,#7C3AED)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Mulai Ngobrol via WA
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8 pb-24">
        <p className="text-center text-white/35 text-sm uppercase tracking-widest mb-10">Topik yang Sering Dibahas</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {TOPICS.map((t, i) => (
            <div key={i} className="bg-white/5 border border-white/8 hover:border-purple-400/30 rounded-2xl p-6 transition-all">
              <h3 className="font-semibold text-white text-sm mb-2">{t.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center bg-white/4 border border-white/8 rounded-2xl p-10">
          <p className="text-white/55 text-base max-w-lg mx-auto mb-6">
            Tidak ada sesi formal, tidak ada judgement. Kirim pesan WA dan kami akan respons dengan hangat.
          </p>
          <a href={"https://wa.me/" + WA + "?text=Halo!%20Saya%20mau%20curhat%20digital.%20Boleh%20ngobrol?"}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-purple-400/30 text-purple-300 rounded-xl hover:bg-purple-500/10 transition-all text-sm font-medium">
            Kirim Pesan Sekarang
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
      <FloatingWA />
    </div>
  )
}