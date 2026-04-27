"use client";
// src/components/CtaBanner.tsx
import { motion } from "framer-motion";
import Link from "next/link";

export default function CtaBanner() {
  const WA_NUM = process.env.NEXT_PUBLIC_WA_NUMBER || "628xxxxxxxxxx";
  return (
    <section className="bg-gold border-y-4 border-navy py-16 px-6 text-center">
      <div className="inner-max">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="font-pixel text-[0.42rem] text-navy/50 mb-2 tracking-widest">SIAP UNTUK MULAI?</div>
          <h2 className="font-pixel text-[clamp(0.8rem,2.5vw,1.2rem)] text-navy mb-3 leading-loose">
            WUJUDKAN PROYEK IMPIANMU<br />BERSAMA TUGASIN DIGITAL
          </h2>
          <p className="text-navy/60 mb-8 max-w-xl mx-auto">
            Dari tugas sederhana hingga rebranding perusahaan — tim kami siap membantu.
            Konsultasi gratis, tanpa komitmen.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/order" className="btn-primary">
              ORDER SEKARANG →
            </Link>
            <a
              href={`https://wa.me/${WA_NUM}?text=${encodeURIComponent("Halo Tugasin Digital! Saya mau konsultasi dulu 😊")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa"
            >
              💬 CHAT ADMIN
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
