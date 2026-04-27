"use client";
// src/components/Navbar.tsx

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Beranda",   href: "/" },
  { label: "Layanan",   href: "/#services" },
  { label: "Testimoni", href: "/#testimonials" },
  { label: "Cek Order", href: "/track" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#1A2540] sticky top-0 z-50 border-b-4 border-[#F4B41A]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        
        {/* LOGO AREA - Clean PNG with Outer Glow */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Logo Tugasin Digital" 
              width={48} 
              height={48}
              className="object-contain transition-all duration-300 group-hover:scale-110 
                         /* Efek Glow Putih Terang agar logo PNG tidak tenggelam di BG Navy */
                         drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] 
                         /* Glow berubah Gold saat di-hover */
                         group-hover:drop-shadow-[0_0_15px_rgba(244,180,26,0.6)]"
              priority 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tighter text-white leading-none uppercase">
              Tugasin <span className="text-[#F4B41A]">Digital</span>
            </span>
            <span className="text-[10px] text-[#F4B41A] font-bold tracking-[0.2em] uppercase mt-0.5 leading-none">
              Service Digital
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/80 hover:text-[#F4B41A] text-[13px] font-semibold transition-colors duration-200 uppercase tracking-wider"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="ml-2 bg-[#F4B41A] text-[#1A2540] px-6 py-2.5 text-[11px] font-black border-b-4 border-[#C68D00] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all duration-100"
          >
            ORDER SEKARANG
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white hover:text-[#F4B41A] transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="md:hidden bg-[#1A2540] border-t-2 border-[#F4B41A]/20 flex flex-col px-6 pb-10 shadow-2xl animate-in slide-in-from-top duration-300">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white/90 text-sm py-5 border-b border-white/5 font-bold hover:text-[#F4B41A] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/order"
            onClick={() => setOpen(false)}
            className="mt-8 bg-[#F4B41A] text-[#1A2540] text-center py-4 font-black text-sm border-b-4 border-[#C68D00]"
          >
            ORDER SEKARANG
          </Link>
        </div>
      )}
    </nav>
  );
}