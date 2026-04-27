'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatRupiah } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types/database'

const STATUS_COLOR: Record<OrderStatus, string> = {
  Baru:       'bg-blue-50 text-blue-700 border-blue-200',
  Proses:     'bg-amber-50 text-amber-700 border-amber-200',
  Pelunasan:  'bg-purple-50 text-purple-700 border-purple-200',
  Selesai:    'bg-green-50 text-green-700 border-green-200',
  Revisi:     'bg-orange-50 text-orange-700 border-orange-200',
  Dibatalkan: 'bg-red-50 text-red-700 border-red-200',
}

export default function ClientPortalPage() {
  const [wa, setWa] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  async function lookup() {
    if (!wa.trim()) return
    setLoading(true); setError(''); setSearched(true)
    const clean = wa.replace(/\D/g, '').replace(/^0/, '62')
    try {
      const { data } = await supabase.from('orders').select('*').or(`whatsapp.eq.${clean},whatsapp.eq.0${clean.slice(2)}`).order('created_at', { ascending: false })
      setOrders(data || [])
      if (!data?.length) setError('Tidak ada order yang terhubung ke nomor ini.')
    } catch { setError('Gagal mengambil data.') } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-platinum/20">
      <div className="bg-navy py-20 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <div className="section-label mb-5 inline-flex" style={{ background: 'rgba(244,180,26,0.1)', borderColor: 'rgba(244,180,26,0.3)', color: '#F4B41A' }}>
            ✦ Portal Klien
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Semua Order
            <span className="block italic text-shimmer">Anda di Satu Tempat</span>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto">Masukkan nomor WhatsApp untuk melihat semua riwayat order Anda.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12">
        {/* Lookup form */}
        <div className="bg-white rounded-2xl border border-platinum/60 shadow-luxury p-6 mb-8">
          <h2 className="font-semibold text-navy mb-4">Cari Order Saya</h2>
          <div className="flex gap-3">
            <input
              className="input-luxury flex-1"
              placeholder="Nomor WhatsApp: 08xxxxxxxxxx"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookup()}
            />
            <button onClick={lookup} disabled={loading} className="btn-navy px-6 rounded-xl flex-shrink-0 disabled:opacity-50">
              {loading ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-3 flex items-center gap-1.5"><span>⚠️</span>{error}</p>}
        </div>

        {/* Orders list */}
        {searched && !loading && orders.length > 0 && (
          <div className="space-y-4">
            <p className="text-navy/50 text-sm font-medium">{orders.length} order ditemukan</p>
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-platinum/60 shadow-luxury p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-mono text-sm font-semibold text-navy">{o.order_id}</div>
                    <div className="text-navy/50 text-xs mt-0.5">{o.service_name}</div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLOR[o.status as OrderStatus] || ''}`}>{o.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-platinum/40">
                  <div><div className="text-navy/40 text-[10px] uppercase tracking-widest mb-0.5">Harga</div><div className="text-navy font-semibold text-sm">{o.price ? formatRupiah(o.price) : 'Diskusi'}</div></div>
                  <div><div className="text-navy/40 text-[10px] uppercase tracking-widest mb-0.5">Bayar</div><div className="text-navy font-semibold text-sm">{o.payment_status}</div></div>
                  <div><div className="text-navy/40 text-[10px] uppercase tracking-widest mb-0.5">Deadline</div><div className="text-navy font-semibold text-sm text-xs">{o.deadline || '—'}</div></div>
                </div>

                <div className="flex gap-3">
                  <a href={`/track?id=${o.order_id}`} className="flex-1 text-center py-2 text-sm font-medium text-navy/70 border border-navy/15 rounded-lg hover:bg-navy hover:text-white hover:border-navy transition-all">
                    Lihat Detail
                  </a>
                  {o.result_files && (
                    <a href={o.result_files} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center py-2 text-sm font-medium bg-gold text-navy rounded-lg hover:bg-gold-light transition-colors">
                      Unduh File
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
