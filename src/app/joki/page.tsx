import Link from 'next/link'
import FloatingWA from '@/components/FloatingWA'

const WA = process.env.NEXT_PUBLIC_WA_NUMBER || '6289540108751'

const PACKAGES = [
  { name: 'Makalah & Essay', desc: 'Makalah 5-20 halaman, referensi valid, format APA/MLA/Chicago.', price: 'Rp 50rb+', tags: ['Makalah','Essay','Opini'], turnaround: '12-48 jam' },
  { name: 'Laporan & Resume', desc: 'Laporan praktikum, kerja praktek, atau resume akademik terstruktur.', price: 'Rp 75rb+', tags: ['Laporan','Resume','PKL'], turnaround: '1-3 hari' },
  { name: 'Joki Coding', desc: 'Python, JavaScript, PHP, SQL, Java — tugas kampus maupun bootcamp.', price: 'Rp 75rb+', tags: ['Python','JavaScript','PHP'], turnaround: '6-24 jam' },
  { name: 'Analisis Data & SPSS', desc: 'Pengolahan data, uji statistik, interpretasi hasil, bab 4 skripsi.', price: 'Rp 100rb+', tags: ['SPSS','Excel','R'], turnaround: '1-3 hari' },
  { name: 'Presentasi & PPT', desc: 'Slide presentasi tugas kuliah, seminar, atau sidang skripsi.', price: 'Rp 60rb+', tags: ['PowerPoint','Canva'], turnaround: '6-24 jam' },
  { name: 'Riset & Literature Review', desc: 'Tinjauan pustaka, state-of-the-art, sitasi Mendeley/Zotero.', price: 'Rp 100rb+', tags: ['Riset','Jurnal','Sitasi'], turnaround: '2-5 hari' },
]

export const metadata = { title: 'Joki Tugas Akademik | Tugasin Digital' }

export default function JokiPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-400/20 rounded-full text-purple-300 text-xs font-semibold tracking-widest uppercase mb-6">
            Akademik Profesional
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white mb-5">
            Joki Tugas
            <span className="block italic text-shimmer">Aman & Terstruktur</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            Makalah, coding assignment, analisis data — dikerjakan profesional dengan alur aman dan terjamin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order?service=Joki+Tugas" className="btn-gold px-8 py-4 rounded-xl font-semibold text-base shadow-gold">Order Sekarang</Link>
            <a href={"https://wa.me/" + WA + "?text=Halo!%20Saya%20butuh%20bantuan%20tugas%20akademik."} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl hover:border-white/40 hover:bg-white/5 transition-all text-base font-medium">
              Diskusi via WA
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-platinum/60 bg-platinum/20 py-5">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[["100%","Privasi Terjaga"],["24/7","Siap Dikerjakan"],["2x","Revisi Gratis"],["<5 Min","Response Time"]].map(([v,l]) => (
            <div key={l}><div className="font-display text-2xl font-semibold text-navy">{v}</div><div className="text-navy/45 text-xs font-medium">{l}</div></div>
          ))}
        </div>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <div className="section-label mb-4">Paket Layanan</div>
          <h2 className="font-display text-4xl font-semibold text-navy">Pilih Jenis Tugas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PACKAGES.map((pkg, i) => (
            <div key={i} className="bg-white rounded-2xl border border-platinum/60 hover:border-purple-300 hover:shadow-luxury p-6 transition-all duration-300 group">
              <h3 className="font-semibold text-navy text-base mb-2 group-hover:text-purple-700 transition-colors">{pkg.name}</h3>
              <p className="text-navy/55 text-sm leading-relaxed mb-4">{pkg.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">{pkg.tags.map(t => <span key={t} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[11px] font-medium rounded-md">{t}</span>)}</div>
              <div className="flex items-center justify-between pt-4 border-t border-platinum/40">
                <div><div className="text-[10px] text-navy/30 uppercase tracking-widest">Harga</div><div className="text-gold font-semibold text-sm">{pkg.price}</div></div>
                <div className="text-right"><div className="text-[10px] text-navy/30 uppercase tracking-widest">Estimasi</div><div className="text-navy/60 text-xs font-medium">{pkg.turnaround}</div></div>
              </div>
              <Link href={"/order?service=" + encodeURIComponent(pkg.name)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 border border-purple-200 text-purple-600 text-sm font-medium rounded-xl hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200">
                Pesan Sekarang
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          ))}
        </div>
      </section>
      <FloatingWA />
    </div>
  )
}