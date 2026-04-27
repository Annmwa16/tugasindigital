'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatRupiahShort, formatWANumber } from '@/lib/utils'
import type { Service } from '@/types/database'
import toast from 'react-hot-toast'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '6289540108751'
const GOOGLE_SCRIPT = process.env.NEXT_PUBLIC_GOOGLE_SHEET_SCRIPT || ''

const FALLBACK_SERVICES: Service[] = [
  { id: 1, service_name: 'UI/UX Design Modern', category: 'Creative & Visual', pillar: 'face', description: '', price_min: 150000, price_max: 800000, icon: '🎨', is_active: true, created_at: '' },
  { id: 2, service_name: 'Social Media Management', category: 'Creative & Visual', pillar: 'face', description: '', price_min: 200000, price_max: 1500000, icon: '📱', is_active: true, created_at: '' },
  { id: 3, service_name: 'Pitch Deck & Presentasi', category: 'Creative & Visual', pillar: 'face', description: '', price_min: 100000, price_max: 600000, icon: '📊', is_active: true, created_at: '' },
  { id: 4, service_name: 'UGC Agency', category: 'Creative & Visual', pillar: 'face', description: '', price_min: 300000, price_max: 2000000, icon: '🎬', is_active: true, created_at: '' },
  { id: 5, service_name: 'Personal Branding Architect', category: 'Growth & Social', pillar: 'brain', description: '', price_min: 250000, price_max: 1000000, icon: '👤', is_active: true, created_at: '' },
  { id: 6, service_name: 'Engagement Booster', category: 'Growth & Social', pillar: 'brain', description: '', price_min: 150000, price_max: 500000, icon: '📈', is_active: true, created_at: '' },
  { id: 7, service_name: 'Digital Legacy (Aetheris)', category: 'Growth & Social', pillar: 'brain', description: '', price_min: 500000, price_max: 5000000, icon: '🏫', is_active: true, created_at: '' },
  { id: 8, service_name: 'Digital Asset & Security', category: 'Technical', pillar: 'backbone', description: '', price_min: 200000, price_max: 1000000, icon: '🔒', is_active: true, created_at: '' },
  { id: 9, service_name: 'Web Maintenance & SEO', category: 'Technical', pillar: 'backbone', description: '', price_min: 180000, price_max: 1500000, icon: '⚡', is_active: true, created_at: '' },
  { id: 10, service_name: 'AI Research & Data Scraping', category: 'Technical', pillar: 'backbone', description: '', price_min: 300000, price_max: 2000000, icon: '🤖', is_active: true, created_at: '' },
  { id: 11, service_name: 'Virtual Assistant Pro', category: 'Technical', pillar: 'backbone', description: '', price_min: 350000, price_max: 3000000, icon: '🗂️', is_active: true, created_at: '' },
]

type FormErrors = Partial<Record<string, string>>

export default function OrderForm() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>(FALLBACK_SERVICES)
  
  // FIX: Start dengan string kosong untuk menghindari Hydration Error
  const [orderId, setOrderId] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedPrice, setSelectedPrice] = useState<{ min: number; max: number } | null>(null)
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    service: searchParams?.get('service') || '',
    deadline: '',
    detail: '',
    budget: '',
    agreed: false,
  })

  useEffect(() => {
    // FIX: Generate ID singkat TD-XXXX hanya di client side
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setOrderId(`TD-${randomDigits}`);

    async function loadServices() {
      try {
        const { data } = await supabase.from('services').select('*').eq('is_active', true).order('category')
        if (data && data.length) setServices(data)
      } catch {}
    }
    loadServices()
  }, [])

  useEffect(() => {
    if (form.service) {
      const svc = services.find((s) => s.service_name === form.service)
      if (svc) setSelectedPrice({ min: svc.price_min, max: svc.price_max })
      else setSelectedPrice(null)
    }
  }, [form.service, services])

  const categories = [...new Set(services.map((s) => s.category))]

  function validate() {
    const e: FormErrors = {}
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Nama minimal 2 karakter'
    if (!/^08\d{8,13}$/.test(form.whatsapp.replace(/\s/g, ''))) e.whatsapp = 'Format: 08xxxxxxxxxx'
    if (!form.service) e.service = 'Pilih layanan terlebih dahulu'
    if (!form.deadline || new Date(form.deadline) <= new Date()) e.deadline = 'Deadline harus di masa depan'
    if (form.detail.trim().length < 20) e.detail = 'Deskripsi minimal 20 karakter'
    if (!form.agreed) e.agreed = 'Anda harus menyetujui ketentuan'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function uploadFiles(id: string): Promise<string[]> {
    const urls: string[] = []
    for (const f of files) {
      const path = `${id}/${Date.now()}_${f.name}`
      const { data, error } = await supabase.storage.from('order-files').upload(path, f)
      if (!error && data) {
        const { data: u } = supabase.storage.from('order-files').getPublicUrl(path)
        urls.push(u.publicUrl)
      }
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const loadingToast = toast.loading('Mengirim order...')

    try {
      let fileUrls: string[] = []
      if (files.length) {
        toast.loading('Mengupload file...', { id: loadingToast })
        fileUrls = await uploadFiles(orderId)
      }

      const payload = {
        order_id: orderId,
        customer_name: form.name.trim(),
        whatsapp: formatWANumber(form.whatsapp),
        service_name: form.service,
        deadline: form.deadline,
        detail_request: form.detail.trim(),
        status: 'Baru' as const,
        payment_status: 'Belum Bayar' as const,
        price: form.budget ? parseInt(form.budget) : null,
        file_urls: fileUrls.join(', ') || null,
      }

      await (supabase.from('orders') as any).insert([payload] as any)

      if (GOOGLE_SCRIPT) {
        fetch(GOOGLE_SCRIPT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {})
      }

      const fileNote = fileUrls.length ? `\n\nFile referensi: ${fileUrls.length} file sudah diupload.` : ''
      const msg = encodeURIComponent(
`━━━━━━━━━━━━━━━━━━━━
KONFIRMASI ORDER — TUGASIN DIGITAL
━━━━━━━━━━━━━━━━━━━━

ID Order  : ${orderId}
Nama      : ${payload.customer_name}
Layanan   : ${payload.service_name}
Deadline  : ${new Date(payload.deadline).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
Budget    : ${payload.price ? 'Rp ' + payload.price.toLocaleString('id-ID') : 'Diskusi'}

Detail:
${payload.detail_request}${fileNote}

Mohon konfirmasi dan info DP-nya. Terima kasih!`
      )

      toast.success('Order berhasil dikirim! 🎉', { id: loadingToast })
      setSubmitted(true)

      setTimeout(() => {
        window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
      }, 1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      toast.error(`Gagal: ${msg}`, { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-5">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">🎉</div>
        <h2 className="font-display text-3xl font-semibold text-navy mb-3">Order Terkirim!</h2>
        <p className="text-navy/50 mb-3">ID Order Anda:</p>
        <div className="font-mono text-lg font-semibold text-gold bg-gold/10 border border-gold/30 rounded-xl px-6 py-3 mb-6 inline-block">
            {orderId}
        </div>
        <p className="text-navy/50 text-sm mb-8">Simpan ID ini untuk mengecek status order. Anda akan diarahkan ke WhatsApp.</p>
        <div className="flex flex-col gap-3">
          <a
            href={`/track?id=${orderId}`}
            className="btn-navy w-full rounded-xl py-3 text-center"
          >
            Cek Status Order
          </a>
          <button onClick={() => setSubmitted(false)} className="btn-ghost w-full rounded-xl py-3 text-sm">
            Buat Order Baru
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-5 md:px-8 py-12">
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order ID Section */}
          <div className="bg-navy/3 border border-gold/20 rounded-xl px-5 py-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-navy/40 uppercase tracking-widest font-medium mb-0.5">ID Order</div>
              <div className="font-mono text-sm font-semibold text-navy">{orderId || 'GEN-ID...'}</div>
            </div>
            <span className="text-xs text-navy/30 bg-navy/5 px-3 py-1 rounded-full">Auto-generated</span>
          </div>

          {/* Name & WA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
              <input
                className={`input-luxury ${errors.name ? 'error' : ''}`}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">WhatsApp <span className="text-red-500">*</span></label>
              <input
                className={`input-luxury ${errors.whatsapp ? 'error' : ''}`}
                placeholder="08xxxxxxxxxx"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
            </div>
          </div>

          {/* Service */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Layanan <span className="text-red-500">*</span></label>
            <select
              className={`input-luxury ${errors.service ? 'error' : ''}`}
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              <option value="">-- Pilih Layanan --</option>
              {categories.map((cat) => (
                <optgroup key={cat} label={`── ${cat} ──`}>
                  {services.filter((s) => s.category === cat).map((s) => (
                    <option key={s.id} value={s.service_name}>{s.service_name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
            {selectedPrice && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-navy/40">Estimasi harga:</span>
                <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                  {formatRupiahShort(selectedPrice.min)} — {formatRupiahShort(selectedPrice.max)}
                </span>
              </div>
            )}
          </div>

          {/* Deadline & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Deadline <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                className={`input-luxury ${errors.deadline ? 'error' : ''}`}
                min={new Date(Date.now() + 3600000).toISOString().slice(0, 16)}
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
              {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">
                Budget <span className="text-navy/30 font-normal text-xs">(opsional)</span>
              </label>
              <input
                type="number"
                className="input-luxury"
                placeholder="Contoh: 250000"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
              <p className="text-xs text-navy/35 mt-1">Kosongkan jika ingin didiskusikan.</p>
            </div>
          </div>

          {/* Detail */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              Detail Kebutuhan <span className="text-red-500">*</span>
              <span className="text-navy/30 font-normal text-xs ml-2">({form.detail.length}/min 20)</span>
            </label>
            <textarea
              rows={5}
              className={`input-luxury resize-y min-h-[120px] ${errors.detail ? 'error' : ''}`}
              placeholder="Jelaskan kebutuhan Anda secara detail: topik, tujuan, referensi, preferensi gaya, dsb..."
              value={form.detail}
              onChange={(e) => setForm({ ...form, detail: e.target.value })}
            />
            {errors.detail && <p className="text-red-500 text-xs mt-1">{errors.detail}</p>}
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              File Referensi <span className="text-navy/30 font-normal text-xs">(maks. 3 file, 5MB each)</span>
            </label>
            <div
              className="border-2 border-dashed border-platinum-dark rounded-xl p-8 text-center hover:border-navy/40 transition-colors cursor-pointer relative"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const newFiles = Array.from(e.dataTransfer.files).filter((f) => f.size <= 5*1024*1024).slice(0, 3 - files.length)
                setFiles([...files, ...newFiles].slice(0, 3))
              }}
            >
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files || []).filter((f) => f.size <= 5*1024*1024).slice(0, 3 - files.length)
                  setFiles([...files, ...newFiles].slice(0, 3))
                }}
              />
              <div className="text-3xl mb-2">📎</div>
              <p className="text-navy/50 text-sm">Drag & drop atau klik untuk upload</p>
              <p className="text-navy/30 text-xs mt-1">PNG, JPG, PDF, DOC (maks. 5MB)</p>
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-navy/3 border border-platinum/60 rounded-lg px-4 py-2.5">
                    <span className="text-sm font-medium text-navy truncate flex-1">{f.name}</span>
                    <span className="text-xs text-navy/40 mx-3">{(f.size/1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ketentuan */}
          <div className="bg-navy/3 border border-platinum/60 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-navy mb-3">Ketentuan Order</h4>
            <ul className="text-navy/50 text-sm space-y-1.5 list-disc list-inside">
              <li>Uang dibayarkan sebelum pengerjaan dimulai</li>
              <li>Revisi gratis 3x setelah hasil dikirimkan</li>
              <li>Pelunasan setelah klien menyetujui kesepakatan</li>
              <li>Deadline dihitung dari Uang Muka masuk</li>
            </ul>
            <label className="flex items-start gap-3 mt-4 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 accent-navy"
                checked={form.agreed}
                onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
              />
              <span className="text-sm font-medium text-navy">Saya sudah membaca dan menyetujui ketentuan di atas</span>
            </label>
            {errors.agreed && <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 rounded-xl text-base font-semibold shadow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mengirim...' : 'Kirim Order'}
          </button>
        </form>
      </div>

      {/* Sidebar Alur Order */}
      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-platinum/60 p-6">
          <h4 className="font-semibold text-navy text-sm mb-5">Alur Order</h4>
          {[
            { n: '1', t: 'Isi Form', d: 'Kirim detail dan deadline Anda.' },
            { n: '2', t: 'Konfirmasi WA', d: 'Tim konfirmasi harga dalam < 5 menit.' },
            { n: '3', t: 'Uang Muka', d: 'Transfer Uang, pengerjaan dimulai.' },
            { n: '4', t: 'Terima File', d: 'Bayar pelunasan setelah puas.' },
          ].map((s, i) => (
            <div key={i} className="flex gap-3 mb-4 last:mb-0">
              <div className="w-7 h-7 bg-navy text-gold flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0">{s.n}</div>
              <div>
                <div className="text-sm font-semibold text-navy">{s.t}</div>
                <div className="text-xs text-navy/50">{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gold rounded-2xl border border-navy/10 p-6 text-center">
          <div className="font-display text-5xl font-semibold text-navy mb-1">&lt;5</div>
          <div className="text-navy font-semibold">Menit Response</div>
          <p className="text-navy/60 text-xs mt-2">Konfirmasi WA setelah form dikirim</p>
        </div>

        <a
          href={`https://wa.me/${WA_NUMBER}?text=Halo!%20Saya%20ingin%20konsultasi%20sebelum%20order.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:bg-[#1DA851] transition-colors"
        >
          Chat Dulu Sebelum Order
        </a>
      </div>
    </div>
  )
}
