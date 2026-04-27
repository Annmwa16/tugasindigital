"use client";
// src/components/Testimonials.tsx

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Testimonial } from "@/types";

const FALLBACK: Testimonial[] = [
  { id: 1, customer_name: "Rizky M.", service_name: "Skripsi", rating: 5, message: "Gila, bab 3 & 4 selesai dalam 2 hari! Hasilnya rapi banget, dosen saya sampai bilang 'ini yang terbaik dari semua mahasiswa.' Recommended banget!", approved: true, created_at: "" },
  { id: 2, customer_name: "Sari A.", service_name: "PPT & Pitch Deck", rating: 5, message: "PPT untuk investor pitching jadi jauh lebih pro. Designer-nya ngerti banget storytelling. Closing deal dalam presentasi pertama!", approved: true, created_at: "" },
  { id: 3, customer_name: "UMKM Nusantara", service_name: "Paket Branding UMKM", rating: 5, message: "Branding kit lengkap: logo, template IG, dan company profile. Semuanya konsisten dan Service. Klien kami langsung makin percaya!", approved: true, created_at: "" },
  { id: 4, customer_name: "Dewi K.", service_name: "Coding PHP", rating: 5, message: "Sistem manajemen inventory untuk toko saya selesai tepat waktu dan bebas bug. Support after-service juga responsif. 10/10!", approved: true, created_at: "" },
];

export default function Testimonials() {
  const [items, setItems]   = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true)
        .order("id", { ascending: false })
        .limit(8);
      setItems(data?.length ? data : FALLBACK);
    })();
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!items.length) return;
    timer.current = setTimeout(() => setActive((a) => (a + 1) % items.length), 5000);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [active, items.length]);

  const stars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < n ? "#F4B41A" : "#d0d8e4" }}>★</span>
    ));

  if (!items.length) return null;

  const cur = items[active];
  const initials = cur.customer_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section id="testimonials" className="section-pad bg-navy bg-grid">
      <div className="inner-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="sec-label text-white/40">APA KATA MEREKA</p>
          <h2 className="sec-title text-white">
            TESTIMONI <span className="text-gold">KLIEN KAMI</span>
          </h2>
        </motion.div>

        {/* Main slider */}
        <div className="max-w-2xl mx-auto mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={cur.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-4 border-gold p-8"
              style={{ boxShadow: "10px 10px 0 #F4B41A" }}
            >
              <div className="text-xl mb-4">{stars(cur.rating)}</div>
              <p className="text-navy text-base leading-relaxed italic mb-6">
                &ldquo;{cur.message}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t-2 border-[#f0f4f8]">
                <div className="w-10 h-10 bg-navy flex items-center justify-center font-pixel text-[0.65rem] text-gold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="font-bold text-navy text-sm">{cur.customer_name}</div>
                  <div className="text-xs text-slate-400">{cur.service_name}</div>
                </div>
                <span className="ml-auto font-pixel text-[0.35rem] text-gold border-2 border-gold px-2 py-1">
                  VERIFIED ✓
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex gap-2 justify-center mt-5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`transition-all duration-200 border-2 border-gold ${
                  i === active ? "w-6 h-3 bg-gold" : "w-3 h-3 bg-transparent"
                }`}
                aria-label={`Testimoni ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mini grid (other testimonials) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.filter((_, i) => i !== active).slice(0, 3).map((t) => {
            const ini = t.customer_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div
                key={t.id}
                onClick={() => setActive(items.indexOf(t))}
                className="bg-white/10 border-2 border-white/20 p-4 cursor-pointer hover:border-gold transition-colors"
              >
                <div className="text-sm mb-2">{stars(t.rating)}</div>
                <p className="text-white/70 text-xs leading-relaxed italic line-clamp-3">
                  &ldquo;{t.message}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-6 bg-gold flex items-center justify-center font-pixel text-[0.38rem] text-navy flex-shrink-0">
                    {ini}
                  </div>
                  <span className="text-white/50 text-xs">{t.customer_name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
