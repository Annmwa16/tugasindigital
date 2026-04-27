import Hero from '@/components/Hero'
import Pillars from '@/components/Pillars'
import TestimonialSlider from '@/components/TestimonialSlider'
import ServiceMarquee from '@/components/ServiceMarquee'
import FloatingWA from '@/components/FloatingWA'
import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '6289540108751'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceMarquee />
      <Pillars />

      {/* CTA Section */}
      <section className="py-24 bg-platinum/30">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="section-label mb-6">Mulai Sekarang</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy mb-6">
            Siap Bertransformasi
            <span className="block italic text-shimmer">Digital?</span>
          </h2>
          <p className="text-navy/50 text-base max-w-lg mx-auto mb-10">
            Konsultasikan kebutuhan digital Anda dengan tim ahli kami. Gratis, tanpa komitmen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order" className="btn-gold text-base px-8 py-4 rounded-xl font-semibold shadow-gold">
              Order Sekarang
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo!%20Saya%20ingin%20konsultasi%20gratis.`}
              target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-base px-8 py-4 rounded-xl"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>
      </section>

      <TestimonialSlider />

      {/* Process steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <div className="section-label mb-5">Alur Kerja</div>
            <h2 className="font-display text-4xl font-semibold text-navy">
              Proses yang <span className="italic text-shimmer">Transparan</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Isi Form Order', desc: 'Jelaskan kebutuhan, deadline, dan budget Anda.' },
              { num: '02', title: 'Konfirmasi WA', desc: 'Tim kami menghubungi Anda dalam kurang dari 5 menit.' },
              { num: '03', title: 'Uang & Pengerjaan', desc: 'Transfer Uang dan pengerjaan langsung dimulai.' },
              { num: '04', title: 'Terima & Revisi', desc: 'Revisi gratis 3x, bayar pelunasan setelah puas.' },
            ].map((step, i) => (
              <div key={i} className="relative">
                {i < 3 && <div className="hidden md:block absolute top-8 left-[calc(100%-16px)] w-8 h-0.5 bg-gold/30 z-10" />}
                <div className="bg-white rounded-2xl border border-platinum/60 hover:border-navy/20 hover:shadow-luxury p-6 transition-all duration-300">
                  <div className="font-display text-5xl font-light text-navy/10 mb-4">{step.num}</div>
                  <h3 className="font-semibold text-navy mb-2">{step.title}</h3>
                  <p className="text-navy/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special categories CTA */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tugas Bantuan */}
            <Link href="/joki" className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 rounded-2xl p-8 transition-all duration-300">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4B41A" strokeWidth="1.8">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2 group-hover:text-gold transition-colors">Tugas Bantuan</h3>
              <p className="text-white/50 text-sm leading-relaxed">Makalah, skripsi, laporan, coding assignment — dikerjakan profesional dengan alur yang aman dan terstruktur.</p>
              <div className="mt-5 flex items-center gap-2 text-gold/60 text-sm font-medium group-hover:text-gold transition-colors">
                Lihat paket
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>

            {/* Curhat Digital */}
            <Link href="/curhat" className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 rounded-2xl p-8 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-400/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-400/20 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="font-display text-2xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">Curhat Digital</h3>
              <p className="text-white/50 text-sm leading-relaxed">Bingung soal karir, personal branding, atau arah digital? Kami dengarkan dan bantu temukan solusinya.</p>
              <div className="mt-5 flex items-center gap-2 text-purple-400/60 text-sm font-medium group-hover:text-purple-300 transition-colors">
                Cerita sekarang
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <FloatingWA />
    </>
  )
}
