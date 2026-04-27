"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Portfolio } from "@/types/database"
import FloatingWA from "@/components/FloatingWA"

const CATEGORIES = ["Semua", "Creative", "Growth", "Enterprise", "Academic", "Custom"]

const CAT_COLOR: Record<string, string> = {
  Creative: "text-rose-600 bg-rose-50 border-rose-200",
  Growth: "text-amber-600 bg-amber-50 border-amber-200",
  Enterprise: "text-cyan-600 bg-cyan-50 border-cyan-200",
  Academic: "text-purple-600 bg-purple-50 border-purple-200",
  Custom: "text-navy/60 bg-navy/5 border-navy/10",
}

export default function PortfolioPage() {
  // Mulai dengan array kosong agar tidak flicker data dummy
  const [items, setItems] = useState<Portfolio[]>([])
  const [cat, setCat] = useState("Semua")
  const [modal, setModal] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // Pastikan nama tabel di Supabase adalah 'portofolio'
        const { data, error } = await supabase
          .from("portofolio") 
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        if (data) setItems(data)
      } catch (err) {
        console.error("Error loading portfolio:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = cat === "Semua" ? items : items.filter(i => i.kategori === cat)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="section-label mb-6 inline-flex" style={{ background: "rgba(244,180,26,0.1)", borderColor: "rgba(244,180,26,0.3)", color: "#F4B41A" }}>
            Karya Pilihan
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Portofolio
            <span className="block italic text-shimmer">Tugasin Digital</span>
          </h1>
          <p className="text-white/50">Kumpulan proyek nyata yang telah kami kerjakan untuk klien di berbagai industri.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={"px-4 py-2 rounded-full text-sm font-medium border transition-all " +
                (cat === c ? "bg-navy text-white border-navy shadow-luxury" : "bg-white text-navy/55 border-navy/15 hover:border-navy/30")}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <div key={item.id} onClick={() => setModal(item)}
                className="group cursor-pointer bg-white rounded-2xl border border-platinum/60 hover:border-navy/20 hover:shadow-luxury overflow-hidden transition-all duration-300 flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-navy/5 to-navy/10 flex items-center justify-center relative overflow-hidden">
                  {item.foto_url ? (
                    <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-navy/15 text-center p-4 italic text-xs">Tidak ada gambar</div>
                  )}
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-navy/80 px-4 py-2 rounded-full">
                      Lihat Detail
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={"text-[10px] font-semibold px-2.5 py-0.5 rounded-full border " + (CAT_COLOR[item.kategori] || "")}>
                      {item.kategori}
                    </span>
                  </div>
                  <h3 className="font-semibold text-navy text-sm mb-1 break-words line-clamp-1">{item.judul}</h3>
                  <p className="text-navy/50 text-xs leading-relaxed line-clamp-2 break-words">
                    {item.deskripsi || "Tanpa deskripsi."}
                  </p>
                </div>
              </div>
            ))}
            
            {!loading && filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-navy/35">
                <p>Belum ada proyek di kategori ini.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-luxury w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-navy/5 flex items-center justify-center">
              {modal.foto_url ? (
                <img src={modal.foto_url} alt={modal.judul} className="w-full h-full object-cover" />
              ) : (
                <div className="text-navy/15 italic">Gambar tidak tersedia</div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={"text-xs font-semibold px-2.5 py-1 rounded-full border " + (CAT_COLOR[modal.kategori] || "")}>
                  {modal.kategori}
                </span>
              </div>
              <h2 className="font-display text-xl font-semibold text-navy mb-3 break-words">{modal.judul}</h2>
              <div className="max-h-[200px] overflow-y-auto pr-2">
                <p className="text-navy/60 text-sm leading-relaxed break-words whitespace-pre-wrap">
                  {modal.deskripsi || "Tidak ada deskripsi."}
                </p>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setModal(null)} className="flex-1 py-3 border border-platinum rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">Tutup</button>
                <a href={`https://wa.me/628XXXXXXXXX?text=Halo Tugasin Digital, saya tertarik dengan proyek ${modal.judul}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-gold text-navy rounded-xl text-sm font-bold text-center hover:bg-gold-light transition-colors">Order Serupa</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <FloatingWA />
    </div>
  )
}