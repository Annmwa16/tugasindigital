import Link from 'next/link'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '6289540108751'

export default function Footer() {
  return (
    <footer className="bg-[#0D1220] border-t border-gold/8 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-semibold text-white mb-3">
              Tugasin <span className="text-shimmer">Digital</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              Agency digital premium dengan empat pilar: Creative, Growth, Enterprise, dan Membantu Tugas Akademik. Satu tim, semua kebutuhan digital Anda.
            </p>
            <a href={"https://wa.me/" + WA_NUMBER + "?text=Halo%20Tugasin%20Digital!%20Saya%20ingin%20berkonsultasi."}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-sm font-semibold rounded-lg hover:bg-[#1DA851] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat WhatsApp
            </a>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-gold text-[10px] font-semibold tracking-widest uppercase mb-4">Layanan</h4>
            <ul className="space-y-2.5">
              {["UI/UX Design","Social Media","Personal Branding","Web & SEO","AI Research","Bantuan Tugas","Curhat Digital"].map(s => (
                <li key={s}><Link href={"/#layanan"} className="text-white/40 text-sm hover:text-gold transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-gold text-[10px] font-semibold tracking-widest uppercase mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Beranda", href: "/" },
                { label: "Portofolio", href: "/portfolio" },
                { label: "Blog & Tips", href: "/blog" },
                { label: "Order Layanan", href: "/order" },
                { label: "Cek Status Order", href: "/track" },
                { label: "Portal Klien", href: "/client" },
              ].map(l => (
                <li key={l.href}><Link href={l.href} className="text-white/40 text-sm hover:text-gold transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-gold mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Tugasin Digital. Semua hak dilindungi.</p>
          <p className="text-white/15 text-xs">@Tugasin.Digital</p>
        </div>
      </div>
    </footer>
  )
}