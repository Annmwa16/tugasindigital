"use client";
// src/app/login/page.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/admin");
    });
  }, [router]);

  const doLogin = async () => {
    if (!email || !pass) { setError("Isi email dan password dulu."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (err) setError("Email atau password salah. Coba lagi.");
    else router.replace("/admin");
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-navy flex items-center justify-center px-5 bg-grid"
      style={{ backgroundSize: "28px 28px" }}
    >
      <div className="w-full max-w-sm bg-white border-4 border-gold p-10" style={{ boxShadow: "10px 10px 0 #F4B41A" }}>
        <div className="text-center mb-6">
          <Image src="/Service" alt="TD" width={48} height={48} className="mx-auto mb-3 border-2 border-gold" />
          <div className="font-pixel text-[0.9rem] text-gold">TD</div>
          <div className="font-pixel text-[0.4rem] text-navy mt-1 tracking-widest">ADMIN PANEL</div>
          <p className="text-slate-400 text-xs mt-2">Akses terbatas untuk owner</p>
        </div>

        <div className="flex items-center gap-2 bg-[#f0f4f8] border-2 border-slate-200 p-3 mb-5 text-sm text-navy">
          <Lock size={14} className="text-gold flex-shrink-0" />
          Login dengan akun Supabase Auth kamu.
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border-2 border-red-300 p-3 text-red-600 text-sm mb-4">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <label className="block text-sm font-semibold text-navy mb-1.5">Email Admin</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@tugasindigital.com"
          className="input-base mb-4"
          autoComplete="username"
        />

        <label className="block text-sm font-semibold text-navy mb-1.5">Password</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="••••••••"
          className="input-base mb-5"
          autoComplete="current-password"
          onKeyDown={(e) => e.key === "Enter" && doLogin()}
        />

        <button onClick={doLogin} disabled={loading} className="btn-primary w-full justify-center">
          {loading ? "MASUK..." : "MASUK KE DASHBOARD"}
        </button>
      </div>
    </div>
  );
}
