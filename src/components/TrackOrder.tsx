'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatRupiah } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types/database'
import Link from 'next/link'

const STATUS_STEPS: OrderStatus[] = ['Baru', 'Proses', 'Pelunasan', 'Selesai']

const STATUS_META: Record<OrderStatus, { icon: string; color: string; bg: string; desc: string }> = {
  Baru:        { icon: '🆕', color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',   desc: 'Order diterima, menunggu konfirmasi tim.' },
  Proses:      { icon: '⚙️', color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200', desc: 'Tim sedang mengerjakan project Anda.' },
  Pelunasan:   { icon: '💳', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', desc: 'Project selesai, menunggu pelunasan 50%.' },
  Selesai:     { icon: '✅', color: 'text-green-600',  bg: 'bg-green-50 border-green-200', desc: 'Project selesai & pembayaran lunas. Terima kasih!' },
  Revisi:      { icon: '🔄', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', desc: 'Sedang dalam proses revisi.' },
  Dibatalkan:  { icon: '❌', color: 'text-red-600',    bg: 'bg-red-50 border-red-200',    desc: 'Order dibatalkan.' },
}

const PAYMENT_META = {
  'Belum Bayar': { color: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
  'DP 50%':      { color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
  'Lunas':       { color: 'text-green-600',  bg: 'bg-green-50 border-green-200' },
}

export default function TrackOrder() {
  const searchParams = useSearchParams()
  const [inputId, setInputId] = useState(searchParams?.get('id') || '')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const id = searchParams?.get('id')
    if (id) { setInputId(id); fetchOrder(id) }
  }, [])

  async function fetchOrder(id?: string) {
    const searchId = (id || inputId).trim().toUpperCase()
    if (!searchId) { setError('Masukkan ID Order terlebih dahulu'); return }

    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(true)

    try {
      const { data, error: dbErr } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', searchId)
        .single()

      if (dbErr || !data) {
        setError('Order tidak ditemukan. Pastikan ID Order sudah benar.')
      } else {
        setOrder(data)
      }
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const currentStepIdx = order ? STATUS_STEPS.indexOf(order.status as OrderStatus) : -1
  const isSpecialStatus = order && !STATUS_STEPS.includes(order.status as OrderStatus)

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-12">
      {/* Search box */}
      <div className="bg-white rounded-2xl border border-platinum/60 shadow-luxury p-6 mb-8">
        <h2 className="font-semibold text-navy text-base mb-4">Lacak Status Order</h2>
        <div className="flex gap-3">
          <input
            className="input-luxury flex-1"
            placeholder="Contoh: TD-20250424-AB12"
            value={inputId}
            onChange={(e) => setInputId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrder()}
          />
          <button
            onClick={() => fetchOrder()}
            disabled={loading}
            className="btn-navy px-6 rounded-xl flex-shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <span>⚠️</span> {error}
          </div>
        )}
        {!searched && (
          <p className="text-navy/40 text-xs mt-3">ID Order dikirim ke WhatsApp Anda setelah order berhasil.</p>
        )}
      </div>

      {/* Order result */}
      {order && (
        <div className="space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-platinum/60 shadow-luxury overflow-hidden">
            <div className="bg-navy px-6 py-5 flex items-center justify-between">
              <div>
                <div className="text-gold/60 text-xs uppercase tracking-widest font-medium mb-1">ID Order</div>
                <div className="font-mono text-white text-lg font-semibold">{order.order_id}</div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${STATUS_META[order.status as OrderStatus]?.bg || 'bg-gray-50 border-gray-200'}`}>
                <span>{STATUS_META[order.status as OrderStatus]?.icon}</span>
                <span className={STATUS_META[order.status as OrderStatus]?.color}>{order.status}</span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                <div>
                  <div className="text-navy/40 text-xs uppercase tracking-widest mb-1">Klien</div>
                  <div className="font-semibold text-navy text-sm">{order.customer_name}</div>
                </div>
                <div>
                  <div className="text-navy/40 text-xs uppercase tracking-widest mb-1">Layanan</div>
                  <div className="font-semibold text-navy text-sm">{order.service_name}</div>
                </div>
                <div>
                  <div className="text-navy/40 text-xs uppercase tracking-widest mb-1">Harga</div>
                  <div className="font-semibold text-gold text-sm">
                    {order.price ? formatRupiah(order.price) : 'Diskusi'}
                  </div>
                </div>
                <div>
                  <div className="text-navy/40 text-xs uppercase tracking-widest mb-1">Pembayaran</div>
                  <div className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${PAYMENT_META[order.payment_status]?.bg}`}>
                    <span className={PAYMENT_META[order.payment_status]?.color}>{order.payment_status}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {!isSpecialStatus && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    {STATUS_STEPS.map((step, idx) => {
                      const isPast    = idx <= currentStepIdx
                      const isCurrent = idx === currentStepIdx
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center relative">
                          {/* connector line */}
                          {idx > 0 && (
                            <div className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 transition-all duration-500 ${isPast ? 'bg-gold' : 'bg-platinum-dark'}`} />
                          )}
                          {/* circle */}
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                            isCurrent ? 'bg-gold text-navy ring-4 ring-gold/30 animate-pulse-gold' :
                            isPast ? 'bg-gold/80 text-navy' :
                            'bg-platinum-dark text-navy/30'
                          }`}>
                            {isPast && !isCurrent ? '✓' : idx + 1}
                          </div>
                          <div className={`text-[10px] font-medium mt-2 text-center leading-tight ${isCurrent ? 'text-gold' : isPast ? 'text-navy/60' : 'text-navy/30'}`}>
                            {step}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {/* progress percentage bar */}
                  <div className="mt-2 h-1.5 bg-platinum-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-700"
                      style={{ width: `${currentStepIdx >= 0 ? ((currentStepIdx + 1) / STATUS_STEPS.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status description */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${STATUS_META[order.status as OrderStatus]?.bg || 'bg-gray-50 border-gray-200'}`}>
                <span className="text-xl">{STATUS_META[order.status as OrderStatus]?.icon}</span>
                <span className={STATUS_META[order.status as OrderStatus]?.color}>
                  {STATUS_META[order.status as OrderStatus]?.desc}
                </span>
              </div>
            </div>
          </div>

          {/* Detail card */}
          <div className="bg-white rounded-2xl border border-platinum/60 shadow-luxury p-6">
            <h3 className="font-semibold text-navy text-sm mb-4">Detail Order</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-navy/40 text-xs uppercase tracking-widest mb-1">Deadline</div>
                <div className="text-navy text-sm font-medium">{order.deadline || '—'}</div>
              </div>
              <div>
                <div className="text-navy/40 text-xs uppercase tracking-widest mb-1">Tanggal Order</div>
                <div className="text-navy text-sm font-medium">
                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            {order.detail_request && (
              <div>
                <div className="text-navy/40 text-xs uppercase tracking-widest mb-2">Deskripsi Kebutuhan</div>
                <div className="bg-navy/3 border border-platinum/60 rounded-xl px-4 py-3 text-navy/70 text-sm leading-relaxed">
                  {order.detail_request}
                </div>
              </div>
            )}
            {order.notes && (
              <div className="mt-4">
                <div className="text-navy/40 text-xs uppercase tracking-widest mb-2">Catatan dari Tim</div>
                <div className="bg-gold/8 border border-gold/20 rounded-xl px-4 py-3 text-navy text-sm leading-relaxed">
                  {order.notes}
                </div>
              </div>
            )}
            {order.result_files && (
              <div className="mt-4">
                <div className="text-navy/40 text-xs uppercase tracking-widest mb-2">File Hasil</div>
                <a
                  href={order.result_files}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-medium hover:bg-navy-light transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Unduh File Hasil
                </a>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/6289540108751?text=Halo%20tim%20Tugasin!%20Saya%20ingin%20tanya%20update%20order%20ID%20${order.order_id}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:bg-[#1DA851] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Tanya Update via WA
            </a>
            <Link href="/order" className="flex-1 flex items-center justify-center gap-2 py-3 border border-navy/20 text-navy rounded-xl font-semibold text-sm hover:bg-navy hover:text-white transition-all duration-200">
              + Buat Order Baru
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
