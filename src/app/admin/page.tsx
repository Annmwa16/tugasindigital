'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { formatRupiah } from '@/lib/utils'
import type { Order, OrderStatus, PaymentStatus, Testimonial, Portfolio } from '@/types/database'

// ── Blog Post Type ─────────────────────────────────────────────────
interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  read_time: string;
  is_published: boolean;
  created_at?: string;
}
import toast from 'react-hot-toast'

// ── Lucide-style inline icons ─────────────────────────────────────
const Icon = {
  Orders:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  Portfolio: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Star:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Edit:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Whatsapp:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  Plus:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
  Search:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Refresh:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Logout:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Eye:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Image:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Lock:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
}

// ── Types ─────────────────────────────────────────────────────────
const STATUS_OPTIONS: OrderStatus[] = ['Baru', 'Proses', 'Pelunasan', 'Selesai', 'Revisi', 'Dibatalkan']
const PAYMENT_OPTIONS: PaymentStatus[] = ['Belum Bayar', 'DP 50%', 'Lunas']
const STATUS_COLOR: Record<OrderStatus, string> = {
  Baru:       'bg-blue-50 text-blue-700 border-blue-200',
  Proses:     'bg-amber-50 text-amber-700 border-amber-200',
  Pelunasan:  'bg-purple-50 text-purple-700 border-purple-200',
  Selesai:    'bg-green-50 text-green-700 border-green-200',
  Revisi:     'bg-orange-50 text-orange-700 border-orange-200',
  Dibatalkan: 'bg-red-50 text-red-700 border-red-200',
}
type Tab = 'orders' | 'portfolio' | 'testimonials' | 'blog'

// ── Default state helpers ─────────────────────────────────────────
const newPortfolio = (): Omit<Portfolio, 'id' | 'created_at'> => ({ judul: '', kategori: 'Creative', deskripsi: '', foto_url: '', published: false })
const newTestimonial = (): Omit<Testimonial, 'id' | 'created_at'> => ({ name: '', role: '', content: '', rating: 5, foto_url: '', service_name: '', is_published: false })
const newPost = (): Omit<Post, 'id' | 'created_at'> => ({ title: '', slug: '', category: 'Growth', content: '', excerpt: '', read_time: '', is_published: false })

// ── Spinner ───────────────────────────────────────────────────────
const ButtonSpinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3"/>
  </svg>
)

// ═════════════════════════════════════════════════════════════════
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginErr, setLoginErr] = useState('')

  const [tab, setTab] = useState<Tab>('orders')

  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all')
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  // Portfolio state
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [portLoading, setPortLoading] = useState(false)
  const [editingPort, setEditingPort] = useState<(Portfolio | Omit<Portfolio, 'id' | 'created_at'>) | null>(null)
  const [savingPort, setSavingPort] = useState(false)

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [testiLoading, setTestiLoading] = useState(false)
  const [editingTesti, setEditingTesti] = useState<(Testimonial | Omit<Testimonial, 'id' | 'created_at'>) | null>(null)
  const [savingTesti, setSavingTesti] = useState(false)

  // Blog state
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [editingPost, setEditingPost] = useState<(Post | Omit<Post, 'id' | 'created_at'>) | null>(null)
  const [savingPost, setSavingPost] = useState(false)

  // Stats
  const stats = {
    total:   orders.length,
    baru:    orders.filter(o => o.status === 'Baru').length,
    proses:  orders.filter(o => o.status === 'Proses').length,
    selesai: orders.filter(o => o.status === 'Selesai').length,
    revenue: orders.filter(o => o.payment_status === 'Lunas' && o.price).reduce((s, o) => s + (o.price || 0), 0),
  }

  // ── Auth ────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setAuthed(!!session); setCheckingAuth(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setAuthed(!!s))
    return () => subscription.unsubscribe()
  }, [])

  // ── Data loaders ────────────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    try { const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }); setOrders(data || []) }
    catch { toast.error('Gagal memuat order') }
    setOrdersLoading(false)
  }, [])

  const loadPortfolios = useCallback(async () => {
    setPortLoading(true)
    try { const { data } = await supabase.from('portofolio').select('*').order('created_at', { ascending: false }); setPortfolios(data || []) }
    catch { toast.error('Gagal memuat portofolio') }
    setPortLoading(false)
  }, [])

  const loadTestimonials = useCallback(async () => {
    setTestiLoading(true)
    try { const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }); setTestimonials(data || []) }
    catch { toast.error('Gagal memuat testimoni') }
    setTestiLoading(false)
  }, [])

  const loadPosts = useCallback(async () => {
    setPostsLoading(true)
    try { const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }); setPosts(data || []) }
    catch { toast.error('Gagal memuat artikel') }
    setPostsLoading(false)
  }, [])

  useEffect(() => { if (authed) { loadOrders(); loadPortfolios(); loadTestimonials(); loadPosts() } }, [authed, loadOrders, loadPortfolios, loadTestimonials, loadPosts])

  // ── Login / Logout ──────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoginLoading(true); setLoginErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setLoginErr('Email atau password salah.')
    setLoginLoading(false)
  }
  async function handleLogout() { await supabase.auth.signOut(); toast.success('Logout berhasil') }

  // ── Order CRUD ──────────────────────────────────────────────────
  async function saveOrder() {
    if (!editingOrder) return; setSavingOrder(true)
    try {
      // @ts-ignore - Bypass TypeScript strict type checking for Supabase
      const { error } = await supabase.from('orders').update({ 
        status: editingOrder.status, 
        payment_status: editingOrder.payment_status, 
        price: editingOrder.price, 
        notes: editingOrder.notes, 
        result_files: editingOrder.result_files 
      }).eq('id', editingOrder.id)
      if (error) throw error
      toast.success('Order diperbarui'); setEditingOrder(null); loadOrders()
    } catch { toast.error('Gagal menyimpan') }
    setSavingOrder(false)
  }
  async function deleteOrder(id: number) {
    if (!confirm('Yakin hapus order ini?')) return
    // @ts-ignore
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus'); return }
    toast.success('Order dihapus'); loadOrders()
  }

  // ── Portfolio CRUD ──────────────────────────────────────────────
  async function savePortfolio() {
    if (!editingPort) return; setSavingPort(true)

    // LOGIKA OTOMATIS: Mengubah link Google Drive biasa menjadi Direct Link
    let finalFotoUrl = editingPort.foto_url
    if (finalFotoUrl && finalFotoUrl.includes('drive.google.com')) {
      const fileId = finalFotoUrl.match(/\/d\/([^/]+)/)?.[1] || finalFotoUrl.match(/id=([^&]+)/)?.[1]
      if (fileId) {
        finalFotoUrl = `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }

    const portData = {
      ...editingPort,
      foto_url: finalFotoUrl
    }

    try {
      const isNew = !('id' in portData)
      if (isNew) {
        // @ts-ignore
        const { error } = await supabase.from('portofolio').insert([portData])
        if (error) throw error; toast.success('Portofolio ditambahkan')
      } else {
        const { id, created_at, ...data } = portData as Portfolio
        // @ts-ignore
        const { error } = await supabase.from('portofolio').update(data).eq('id', id)
        if (error) throw error; toast.success('Portofolio diperbarui')
      }
      setEditingPort(null); loadPortfolios()
    } catch { toast.error('Gagal menyimpan') }
    setSavingPort(false)
  }

  // ── File Upload ─────────────────────────────────────────────────
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingPort) return

    try {
      setSavingPort(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `porto-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = fileName

      const { data, error } = await supabase.storage
        .from('portofolio-images')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('portofolio-images')
        .getPublicUrl(filePath)

      setEditingPort({ ...editingPort, foto_url: publicUrl })
      toast.success('Foto berhasil diupload!')
      
    } catch (err) {
      toast.error('Gagal upload foto')
      console.error(err)
    } finally {
      setSavingPort(false)
    }
  }

  async function togglePortPublish(p: Portfolio) {
    // @ts-ignore
    const { error } = await supabase.from('portofolio').update({ published: !p.published }).eq('id', p.id)
    if (error) { toast.error('Gagal update'); return }
    toast.success(p.published ? 'Disembunyikan' : 'Dipublikasikan'); loadPortfolios()
  }
  async function deletePortfolio(id: number) {
    if (!confirm('Hapus portofolio ini?')) return
    // @ts-ignore
    const { error } = await supabase.from('portofolio').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus'); return }
    toast.success('Portofolio dihapus'); loadPortfolios()
  }

  // ── Testimonial CRUD ────────────────────────────────────────────
  async function saveTestimonial() {
    if (!editingTesti) return; setSavingTesti(true)
    try {
      const isNew = !('id' in editingTesti)
      if (isNew) {
        // @ts-ignore
        const { error } = await supabase.from('testimonials').insert([editingTesti])
        if (error) throw error; toast.success('Testimoni ditambahkan')
      } else {
        const { id, created_at, ...data } = editingTesti as Testimonial
        // @ts-ignore
        const { error } = await supabase.from('testimonials').update(data).eq('id', id)
        if (error) throw error; toast.success('Testimoni diperbarui')
      }
      setEditingTesti(null); loadTestimonials()
    } catch { toast.error('Gagal menyimpan') }
    setSavingTesti(false)
  }
  async function toggleTestiPublish(t: Testimonial) {
    // @ts-ignore
    const { error } = await supabase.from('testimonials').update({ is_published: !t.is_published }).eq('id', t.id)
    if (error) { toast.error('Gagal update'); return }
    toast.success(t.is_published ? 'Disembunyikan' : 'Dipublikasikan'); loadTestimonials()
  }
  async function deleteTestimonial(id: number) {
    if (!confirm('Hapus testimoni ini?')) return
    // @ts-ignore
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus'); return }
    toast.success('Testimoni dihapus'); loadTestimonials()
  }

  // ── Blog CRUD ──────────────────────────────────────────────────
  async function savePost() {
    if (!editingPost) return; setSavingPost(true)
    const postData = {
      ...editingPost,
      slug: editingPost.slug || editingPost.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }
    try {
      const isNew = !('id' in postData)
      if (isNew) {
        // @ts-ignore
        const { error } = await supabase.from('posts').insert([postData])
        if (error) throw error; toast.success('Artikel ditambahkan')
      } else {
        const { id, created_at, ...data } = postData as Post
        // @ts-ignore
        const { error } = await supabase.from('posts').update(data).eq('id', id)
        if (error) throw error; toast.success('Artikel diperbarui')
      }
      setEditingPost(null); loadPosts()
    } catch { toast.error('Gagal menyimpan artikel') }
    setSavingPost(false)
  }
  async function togglePostPublish(p: Post) {
    // @ts-ignore
    const { error } = await supabase.from('posts').update({ is_published: !p.is_published }).eq('id', p.id)
    if (error) { toast.error('Gagal update'); return }
    toast.success(p.is_published ? 'Disembunyikan' : 'Dipublikasikan'); loadPosts()
  }
  async function deletePost(id: number) {
    if (!confirm('Hapus artikel ini?')) return
    // @ts-ignore
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) { toast.error('Gagal menghapus'); return }
    toast.success('Artikel dihapus'); loadPosts()
  }

  const filteredOrders = orders.filter(o => {
    const ms = !search || [o.order_id, o.customer_name, o.service_name, o.whatsapp].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const mf = filterStatus === 'all' || o.status === filterStatus
    return ms && mf
  })

  // ── Screens ────────────────────────────────────────────────────
  if (checkingAuth) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  )

  if (!authed) return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-5 bg-grid">
      <div className="bg-white rounded-2xl shadow-luxury border border-gold/15 p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mx-auto mb-4">
            <Icon.Lock />
          </div>
          <div className="font-display text-2xl font-semibold text-navy">Admin Panel</div>
          <p className="text-navy/40 text-sm mt-1">Tugasin Digital — Akses Terbatas</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Email Admin</label>
            <input className="input-luxury" type="email" placeholder="admin@tugasindigital.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">Password</label>
            <div className="relative">
              <input className="input-luxury pr-10" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy transition-colors">
                {showPass ? <Icon.EyeOff /> : <Icon.Eye />}
              </button>
            </div>
          </div>
          {loginErr && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">{loginErr}</div>}
          <button type="submit" disabled={loginLoading} className="btn-navy w-full py-3 rounded-xl disabled:opacity-50 justify-center">
            {loginLoading ? <><ButtonSpinner /> Masuk...</> : 'Masuk ke Dashboard'}
          </button>
        </form>
        <a href="/" className="block text-center mt-5 text-navy/35 text-sm hover:text-navy transition-colors">← Kembali ke website</a>
      </div>
    </div>
  )

  // ── Dashboard ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      {/* Topbar */}
      <div className="bg-navy border-b border-white/5 px-5 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-navy font-bold text-xs">TD</div>
          <div>
            <div className="text-white font-semibold text-sm">Admin Dashboard</div>
            <div className="text-white/30 text-[11px]">Tugasin Digital</div>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-white/45 hover:text-white text-sm transition-colors">
          <Icon.Logout /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Order',   value: stats.total,                color: 'text-navy' },
            { label: 'Baru Masuk',    value: stats.baru,                 color: 'text-blue-600' },
            { label: 'Dikerjakan',    value: stats.proses,               color: 'text-amber-600' },
            { label: 'Selesai',       value: stats.selesai,              color: 'text-green-600' },
            { label: 'Revenue Lunas', value: formatRupiah(stats.revenue), color: 'text-gold', wide: true },
          ].map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl border border-platinum/50 shadow-sm p-5 ${s.wide ? 'col-span-2 md:col-span-1' : ''}`}>
              <div className={`font-display text-2xl font-semibold mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-navy/40 text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-platinum/50 p-1.5 w-fit shadow-sm">
          {([
            ['orders',       <Icon.Orders />,    'Orders'],
            ['portfolio',    <Icon.Portfolio />, 'Portofolio'],
            ['testimonials', <Icon.Star />,      'Testimoni'],
            ['blog',         <Icon.Edit />,      'Blog'],
          ] as [Tab, React.ReactNode, string][]).map(([key, icon, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-navy text-white shadow-sm' : 'text-navy/50 hover:text-navy'}`}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* ══ ORDERS TAB ═══════════════════════════════════════════ */}
        {tab === 'orders' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30"><Icon.Search /></span>
                <input className="input-luxury pl-10" placeholder="Cari ID, nama, layanan..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input-luxury sm:w-44" value={filterStatus} onChange={e => setFilterStatus(e.target.value as OrderStatus | 'all')}>
                <option value="all">Semua Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={loadOrders} className="btn-ghost px-4 rounded-xl flex-shrink-0 text-sm gap-1.5">
                <Icon.Refresh /> Refresh
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-platinum/50 shadow-sm overflow-hidden">
              {ordersLoading ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-navy/35">
                  <svg className="mx-auto mb-3 opacity-30" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                  <p className="font-medium">Tidak ada order</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-platinum/50 bg-[#F8F9FC]">
                        {['ID Order','Klien','Layanan','Harga','Status','Bayar','Tanggal','Aksi'].map(h => (
                          <th key={h} className="text-left text-[10px] font-semibold text-navy/40 uppercase tracking-widest px-5 py-3.5">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-platinum/40">
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-navy/1.5 transition-colors">
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs font-semibold text-navy bg-navy/5 px-2 py-0.5 rounded">{o.order_id}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-medium text-navy text-sm">{o.customer_name}</div>
                            <div className="text-navy/35 text-xs">{o.whatsapp}</div>
                          </td>
                          <td className="px-5 py-4 text-navy/65 text-sm max-w-[150px] truncate">{o.service_name}</td>
                          <td className="px-5 py-4 text-gold font-semibold text-sm whitespace-nowrap">
                            {o.price ? formatRupiah(o.price) : <span className="text-navy/25 font-normal">—</span>}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[o.status as OrderStatus] || ''}`}>{o.status}</span>
                          </td>
                          <td className="px-5 py-4 text-navy/55 text-xs whitespace-nowrap">{o.payment_status}</td>
                          <td className="px-5 py-4 text-navy/35 text-xs whitespace-nowrap">
                            {new Date(o.created_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'2-digit'})}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setEditingOrder(o)} className="p-1.5 text-navy/35 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors" title="Edit"><Icon.Edit /></button>
                              <a href={`https://wa.me/${o.whatsapp}?text=Halo%20${encodeURIComponent(o.customer_name)}!`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[#25D366] hover:bg-green-50 rounded-lg transition-colors" title="Chat WA"><Icon.Whatsapp /></a>
                              <button onClick={() => deleteOrder(o.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Icon.Trash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="px-5 py-3 border-t border-platinum/40 text-navy/35 text-xs">
                {filteredOrders.length} dari {orders.length} order
              </div>
            </div>
          </div>
        )}

        {/* ══ PORTFOLIO TAB ════════════════════════════════════════ */}
        {tab === 'portfolio' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-navy">Manajemen Portofolio</h2>
              <button onClick={() => setEditingPort(newPortfolio())} className="btn-gold px-4 py-2 rounded-xl text-sm gap-1.5">
                <Icon.Plus /> Tambah Proyek
              </button>
            </div>

            {portLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-platinum/50 shadow-sm overflow-hidden group">
                    <div className="aspect-video bg-navy/5 flex items-center justify-center relative">
                      {p.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.foto_url} alt={p.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-navy/20"><Icon.Image /></div>
                      )}
                      <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${p.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {p.published ? 'Publik' : 'Draft'}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] text-gold font-semibold uppercase tracking-widest mb-1">{p.kategori}</div>
                      <h3 className="font-semibold text-navy text-sm mb-2 break-words">{p.judul}</h3>
                      <p className="text-navy/50 text-xs leading-relaxed line-clamp-2 break-words">{p.deskripsi || '—'}</p>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setEditingPort(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-navy/60 border border-navy/15 rounded-lg hover:bg-navy hover:text-white hover:border-navy transition-all">
                          <Icon.Edit /> Edit
                        </button>
                        <button onClick={() => togglePortPublish(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-navy/60 border border-navy/15 rounded-lg hover:border-navy/30 transition-all">
                          {p.published ? <><Icon.EyeOff /> Sembunyikan</> : <><Icon.Eye /> Publish</>}
                        </button>
                        <button onClick={() => deletePortfolio(p.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-all">
                          <Icon.Trash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {portfolios.length === 0 && (
                  <div className="col-span-3 text-center py-16 text-navy/35 bg-white rounded-2xl border border-platinum/50">
                    <svg className="mx-auto mb-3 opacity-20" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    <p>Belum ada portofolio. Klik "Tambah Proyek".</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ TESTIMONIALS TAB ═════════════════════════════════════ */}
        {tab === 'testimonials' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-navy">Manajemen Testimoni</h2>
              <button onClick={() => setEditingTesti(newTestimonial())} className="btn-gold px-4 py-2 rounded-xl text-sm gap-1.5">
                <Icon.Plus /> Tambah Testimoni
              </button>
            </div>

            {testiLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl border border-platinum/50 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-display text-base font-semibold flex-shrink-0">
                          {t.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-navy text-sm">{t.name}</div>
                          <div className="text-navy/40 text-xs">{t.role || '—'}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${t.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {t.is_published ? 'Publik' : 'Draft'}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(n => (
                        <svg key={n} width="12" height="12" viewBox="0 0 24 24" fill={n <= t.rating ? '#F4B41A' : 'none'} stroke="#F4B41A" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    <p className="text-navy/60 text-sm leading-relaxed line-clamp-3 break-words mb-1">&ldquo;{t.content}&rdquo;</p>
                    {t.service_name && <div className="text-gold/70 text-xs font-medium mb-4">{t.service_name}</div>}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => setEditingTesti(t)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-navy/60 border border-navy/15 rounded-lg hover:bg-navy hover:text-white hover:border-navy transition-all">
                        <Icon.Edit /> Edit
                      </button>
                      <button onClick={() => toggleTestiPublish(t)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-navy/60 border border-navy/15 rounded-lg hover:border-navy/30 transition-all">
                        {t.is_published ? <><Icon.EyeOff /> Sembunyikan</> : <><Icon.Eye /> Publish</>}
                      </button>
                      <button onClick={() => deleteTestimonial(t.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-all">
                        <Icon.Trash />
                      </button>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && (
                  <div className="col-span-2 text-center py-16 text-navy/35 bg-white rounded-2xl border border-platinum/50">
                    <svg className="mx-auto mb-3 opacity-20" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <p>Belum ada testimoni. Klik "Tambah Testimoni".</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ BLOG TAB ══════════════════════════════════════════════ */}
        {tab === 'blog' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-navy">Manajemen Blog</h2>
              <button onClick={() => setEditingPost(newPost())} className="btn-gold px-4 py-2 rounded-xl text-sm gap-1.5">
                <Icon.Plus /> Tulis Artikel
              </button>
            </div>

            {postsLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-platinum/50 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="text-[10px] text-gold font-semibold uppercase tracking-widest mb-1">{p.category}</div>
                        <h3 className="font-semibold text-navy text-sm mb-1 break-words">{p.title}</h3>
                        {p.excerpt && <p className="text-navy/50 text-xs leading-relaxed line-clamp-2 break-words">{p.excerpt}</p>}
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${p.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {p.is_published ? 'Publik' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-navy/35 text-xs mb-3">
                      {p.read_time && <span>⏱ {p.read_time}</span>}
                      <span>•</span>
                      <span className="font-mono">{p.slug}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingPost(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-navy/60 border border-navy/15 rounded-lg hover:bg-navy hover:text-white hover:border-navy transition-all">
                        <Icon.Edit /> Edit
                      </button>
                      <button onClick={() => togglePostPublish(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-navy/60 border border-navy/15 rounded-lg hover:border-navy/30 transition-all">
                        {p.is_published ? <><Icon.EyeOff /> Sembunyikan</> : <><Icon.Eye /> Publish</>}
                      </button>
                      <button onClick={() => deletePost(p.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-all">
                        <Icon.Trash />
                      </button>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="col-span-2 text-center py-16 text-navy/35 bg-white rounded-2xl border border-platinum/50">
                    <svg className="mx-auto mb-3 opacity-20" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    <p>Belum ada artikel. Klik "Tulis Artikel".</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ MODAL: Edit Order ════════════════════════════════════════ */}
      {editingOrder && (
        <Modal title="Edit Order" subtitle={editingOrder.order_id} onClose={() => setEditingOrder(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Status Order</label>
                <select className="input-luxury" value={editingOrder.status} onChange={e => setEditingOrder({...editingOrder, status: e.target.value as OrderStatus})}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Status Bayar</label>
                <select className="input-luxury" value={editingOrder.payment_status} onChange={e => setEditingOrder({...editingOrder, payment_status: e.target.value as PaymentStatus})}>
                  {PAYMENT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Harga Final (Rp)</label>
              <input type="number" className="input-luxury" value={editingOrder.price || ''} onChange={e => setEditingOrder({...editingOrder, price: e.target.value ? parseInt(e.target.value) : null})} placeholder="250000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Catatan untuk Klien</label>
              <textarea rows={3} className="input-luxury resize-none" value={editingOrder.notes || ''} onChange={e => setEditingOrder({...editingOrder, notes: e.target.value})} placeholder="Progress, instruksi, atau info tambahan..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">URL File Hasil</label>
              <input className="input-luxury" value={editingOrder.result_files || ''} onChange={e => setEditingOrder({...editingOrder, result_files: e.target.value})} placeholder="https://drive.google.com/..." />
            </div>
            <div className="bg-navy/3 rounded-xl p-4 text-sm text-navy/60 space-y-1">
              <div><strong>Klien:</strong> {editingOrder.customer_name} — {editingOrder.whatsapp}</div>
              <div><strong>Layanan:</strong> {editingOrder.service_name}</div>
              <div className="break-words whitespace-pre-wrap"><strong>Detail:</strong> {editingOrder.detail_request}</div>
            </div>
          </div>
          <ModalFooter onClose={() => setEditingOrder(null)} onSave={saveOrder} saving={savingOrder} />
        </Modal>
      )}

      {/* ══ MODAL: Edit Portfolio ════════════════════════════════════ */}
      {editingPort && (
        <Modal title={'id' in editingPort ? 'Edit Portofolio' : 'Tambah Proyek'} onClose={() => setEditingPort(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Judul Proyek <span className="text-red-500">*</span></label>
              <input className="input-luxury" value={editingPort.judul} onChange={e => setEditingPort({...editingPort, judul: e.target.value})} placeholder="Nama proyek yang menarik" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Kategori</label>
              <select className="input-luxury" value={editingPort.kategori} onChange={e => setEditingPort({...editingPort, kategori: e.target.value})}>
                {['Creative','Growth','Enterprise','Academic','Custom'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Deskripsi</label>
              <textarea rows={3} className="input-luxury resize-none" value={editingPort.deskripsi || ''} onChange={e => setEditingPort({...editingPort, deskripsi: e.target.value})} placeholder="Ceritakan brief singkat proyek ini..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Foto Proyek</label>
              
              {/* Pratinjau Foto jika sudah ada URL-nya */}
              {editingPort.foto_url && (
                <div className="mb-3 relative w-full aspect-video rounded-xl overflow-hidden border border-platinum">
                  <img src={editingPort.foto_url} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => setEditingPort({...editingPort, foto_url: ''})}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <Icon.Trash />
                  </button>
                </div>
              )}

              {/* Tombol Pilih File */}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="file-upload"
                  disabled={savingPort}
                />
                <label 
                  htmlFor="file-upload" 
                  className="flex items-center justify-center gap-2 w-full py-4 px-4 border-2 border-dashed border-platinum rounded-xl text-sm font-medium text-navy/40 hover:border-gold hover:text-navy transition-all cursor-pointer bg-gray-50/50"
                >
                  {savingPort ? (
                    <>Sedang mengupload...</>
                  ) : (
                    <>
                      <Icon.Plus />
                      {editingPort.foto_url ? 'Ganti Foto' : 'Pilih Foto dari Perangkat'}
                    </>
                  )}
                </label>
              </div>
              <p className="text-[10px] text-navy/40 mt-2 italic">*Foto akan langsung tersimpan di Supabase Storage.</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-navy" checked={editingPort.published} onChange={e => setEditingPort({...editingPort, published: e.target.checked})} />
              <span className="text-sm font-medium text-navy">Langsung publish ke website</span>
            </label>
          </div>
          <ModalFooter onClose={() => setEditingPort(null)} onSave={savePortfolio} saving={savingPort} />
        </Modal>
      )}

      {/* ══ MODAL: Edit Testimonial ══════════════════════════════════ */}
      {editingTesti && (
        <Modal title={'id' in editingTesti ? 'Edit Testimoni' : 'Tambah Testimoni'} onClose={() => setEditingTesti(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Nama <span className="text-red-500">*</span></label>
                <input className="input-luxury" value={editingTesti.name} onChange={e => setEditingTesti({...editingTesti, name: e.target.value})} placeholder="Budi Santoso" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Role / Profesi</label>
                <input className="input-luxury" value={editingTesti.role || ''} onChange={e => setEditingTesti({...editingTesti, role: e.target.value})} placeholder="CEO, Mahasiswa, dsb." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Isi Testimoni <span className="text-red-500">*</span></label>
              <textarea rows={4} className="input-luxury resize-none" value={editingTesti.content} onChange={e => setEditingTesti({...editingTesti, content: e.target.value})} placeholder="Tuliskan ulasan jujur dari klien..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Rating</label>
                <div className="flex gap-1.5 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setEditingTesti({...editingTesti, rating: n})}
                      className="transition-transform hover:scale-110">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={n <= editingTesti.rating ? '#F4B41A' : 'none'} stroke="#F4B41A" strokeWidth="1.8">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Layanan Terkait</label>
                <input className="input-luxury" value={editingTesti.service_name || ''} onChange={e => setEditingTesti({...editingTesti, service_name: e.target.value})} placeholder="UI/UX Design" />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-navy" checked={editingTesti.is_published} onChange={e => setEditingTesti({...editingTesti, is_published: e.target.checked})} />
              <span className="text-sm font-medium text-navy">Langsung tampilkan di website</span>
            </label>
          </div>
          <ModalFooter onClose={() => setEditingTesti(null)} onSave={saveTestimonial} saving={savingTesti} />
        </Modal>
      )}

      {/* ══ MODAL: Edit Blog Post ════════════════════════════════════ */}
      {editingPost && (
        <Modal title={'id' in editingPost ? 'Edit Artikel' : 'Tulis Artikel'} onClose={() => setEditingPost(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Judul Artikel <span className="text-red-500">*</span></label>
              <input className="input-luxury" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} placeholder="Judul artikel yang menarik" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Kategori</label>
                <select className="input-luxury" value={editingPost.category} onChange={e => setEditingPost({...editingPost, category: e.target.value})}>
                  {['Growth','Creative','Enterprise','Academic','Tips','News'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-1.5">Slug (URL)</label>
                <input className="input-luxury font-mono text-sm" value={editingPost.slug} onChange={e => setEditingPost({...editingPost, slug: e.target.value})} placeholder="judul-artikel" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Excerpt / Ringkasan</label>
              <textarea rows={2} className="input-luxury resize-none" value={editingPost.excerpt || ''} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} placeholder="Ringkasan singkat untuk preview..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Konten Artikel <span className="text-red-500">*</span></label>
              <textarea rows={8} className="input-luxury resize-none" value={editingPost.content} onChange={e => setEditingPost({...editingPost, content: e.target.value})} placeholder="Tuliskan konten artikel lengkap di sini..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">Estimasi Waktu Baca</label>
              <input className="input-luxury" value={editingPost.read_time || ''} onChange={e => setEditingPost({...editingPost, read_time: e.target.value})} placeholder="5 menit" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-navy" checked={editingPost.is_published} onChange={e => setEditingPost({...editingPost, is_published: e.target.checked})} />
              <span className="text-sm font-medium text-navy">Langsung publish ke website</span>
            </label>
          </div>
          <ModalFooter onClose={() => setEditingPost(null)} onSave={savePost} saving={savingPost} />
        </Modal>
      )}
    </div>
  )
}

// ── Reusable Modal shell ──────────────────────────────────────────
function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-platinum/50 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div>
            <h3 className="font-semibold text-navy">{title}</h3>
            {subtitle && <p className="text-navy/35 text-xs font-mono mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-navy/35 hover:text-navy hover:bg-navy/5 rounded-lg transition-colors text-xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ModalFooter({ onClose, onSave, saving }: { onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="flex gap-3 mt-6 pt-5 border-t border-platinum/50">
      <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-3">Batal</button>
      <button onClick={onSave} disabled={saving} className="btn-gold flex-1 rounded-xl py-3 disabled:opacity-50 justify-center gap-2">
        {saving ? <><Spinner /> Menyimpan...</> : 'Simpan'}
      </button>
    </div>
  )
}

const Spinner = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3"/></svg>
