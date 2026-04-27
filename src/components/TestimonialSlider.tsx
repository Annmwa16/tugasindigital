'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/types/database'

const fallbackTestimonials: Testimonial[] = [
  { id: 1, name: 'Bintang Perkasa', role: 'Founder, Nusantara Kreatif', content: 'Tugasin Digital benar-benar mengubah cara kami beroperasi secara digital. Desain UI/UX mereka tidak hanya cantik, tapi fungsional dan konversinya luar biasa.', rating: 5, foto_url: null, service_name: 'UI/UX Design', is_published: true, created_at: '' },
  { id: 2, name: 'Maharani Putri', role: 'CEO, Toko Mawar Online', content: 'Social media management mereka membuat followers IG kami naik 3x lipat dalam 2 bulan. Kontennya Service, strategi hashtag-nya sangat terukur.', rating: 5, foto_url: null, service_name: 'Social Media Management', is_published: true, created_at: '' },
  { id: 3, name: 'Rizky Aditya', role: 'Mahasiswa S2 Teknik', content: 'Pitch deck untuk sidang tesis saya dikerjakan dalam 24 jam dengan kualitas yang melebihi ekspektasi. Tim penguji sangat terkesan dengan visualisasi datanya.', rating: 5, foto_url: null, service_name: 'Pitch Deck & Presentasi', is_published: true, created_at: '' },
  { id: 4, name: 'Dewi Sartika', role: 'Brand Manager, UMKM Lokal', content: 'AI Research service mereka membantu kami mendapatkan insight kompetitor yang sangat berharga. Data yang dikumpulkan akurat dan terstruktur dengan baik.', rating: 5, foto_url: null, service_name: 'AI Research & Data Scraping', is_published: true, created_at: '' },
]

export default function TestimonialSlider() {
  const [items, setItems] = useState<Testimonial[]>(fallbackTestimonials)
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
        if (data && data.length) setItems(data)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length)
    }, 5000)
    return () => clearInterval(intervalRef.current)
  }, [items.length])

  const goTo = (i: number) => {
    setCurrent(i)
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setCurrent((c) => (c + 1) % items.length), 5000)
  }

  return (
    <section id="testimoni" className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-semibold tracking-widest uppercase mb-5">
            Kata Mereka
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Kepercayaan yang
            <span className="block italic text-shimmer">Membanggakan</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {items.map((t, i) => (
              <div
                key={t.id}
                className={`transition-all duration-500 ${i === current ? 'opacity-100 block' : 'opacity-0 hidden'}`}
              >
                <div className="glass rounded-3xl p-8 md:p-10 border border-white/10 shadow-luxury">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <svg key={idx} width="18" height="18" viewBox="0 0 24 24" fill="#F4B41A">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-white/85 text-xl md:text-2xl font-display font-light leading-relaxed mb-8">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold font-display text-xl font-semibold">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-white/40 text-xs">{t.role}</div>
                      {t.service_name && (
                        <div className="text-gold/60 text-xs mt-0.5">{t.service_name}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
