"use client";
// src/components/FaqSection.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  { q: "Berapa lama pengerjaan order?", a: "Tergantung jenis layanan dan kompleksitas. Tugas sederhana bisa 1-3 jam, skripsi bisa 1-5 hari. Deadline bisa kamu tentukan saat order." },
  { q: "Bagaimana cara pembayaran?", a: "Sistem Uang Diawal. Transfer bank (BCA/Mandiri/BRI), QRIS, Dana, atau GoPay." },
  { q: "Apakah ada garansi revisi?", a: "Ya! Setiap order mendapat 3x revisi gratis. Revisi tambahan bisa dibicarakan dengan harga yang sangat terjangkau." },
  { q: "Apakah data & brief saya aman?", a: "100% terjaga kerahasiaannya. Kami tidak akan menyebarkan atau menggunakan data kamu di luar kebutuhan pengerjaan order." },
  { q: "Bisa minta sample atau portofolio dulu?", a: "Tentu! Hubungi kami via WhatsApp dan minta portofolio sesuai jenis layanan yang kamu butuhkan. Gratis dan tanpa komitmen." },
  { q: "Apakah bisa order di luar jam kerja?", a: "WhatsApp kami aktif 24/7 untuk menerima order. Pengerjaan dimulai di jam kerja (08.00-22.00 WIB), tapi order darurat bisa dinego!" },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section-pad bg-white border-t-4 border-navy">
      <div className="inner-max">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="sec-label">FAQ</p>
            <h2 className="sec-title">PERTANYAAN<br /><span className="text-gold">YANG SERING</span><br />DITANYAKAN</h2>
            <p className="text-slate-500 text-sm">Tidak menemukan jawaban yang kamu cari? Hubungi kami via WhatsApp!</p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className={`border-3 border-navy transition-all ${open === i ? "bg-navy" : "bg-white"}`} style={{ border: "3px solid #1A2540" }}>
                <button
                  className={`w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-sm transition-colors ${open === i ? "text-white" : "text-navy"}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {faq.q}
                  <span className="font-pixel text-[0.8rem] text-gold flex-shrink-0 ml-3">
                    {open === i ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-white/70 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
