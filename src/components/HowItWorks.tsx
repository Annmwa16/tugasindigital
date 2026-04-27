"use client";
// src/components/HowItWorks.tsx

import { motion } from "framer-motion";

const steps = [
  { n: "01", title: "PILIH LAYANAN",    desc: "Jelajahi 14+ layanan kami dan pilih yang sesuai kebutuhanmu." },
  { n: "02", title: "ISI FORM ORDER",   desc: "Isi brief lengkap di form order. Semakin detail, semakin bagus hasilnya." },
  { n: "03", title: "KONFIRMASI & DP",  desc: "Konfirmasi via WhatsApp dan bayar DP 50% untuk memulai pengerjaan." },
  { n: "04", title: "TERIMA HASIL",     desc: "Kami kerjakan sesuai brief dan deadline. Revisi gratis 1x!" },
];

export function HowItWorks() {
  return (
    <section className="section-pad bg-white border-y-4 border-navy">
      <div className="inner-max">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="sec-label">CARA KERJA</p>
          <h2 className="sec-title">PROSES YANG <span className="text-gold">SIMPEL & CEPAT</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="w-14 h-14 bg-navy text-gold font-pixel text-[0.9rem] flex items-center justify-center mx-auto mb-4"
                style={{ boxShadow: "4px 4px 0 #F4B41A" }}
              >
                {s.n}
              </div>
              <h4 className="font-pixel text-[0.48rem] mb-2 text-navy">{s.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
