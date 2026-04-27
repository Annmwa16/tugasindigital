import { Suspense } from 'react'
import OrderForm from '@/components/OrderForm'

export const metadata = { title: 'Order Layanan | Tugasin Digital' }

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-platinum/20">
      {/* Header */}
      <div className="bg-navy py-20 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <div className="section-label mb-5 inline-flex" style={{ background: 'rgba(244,180,26,0.1)', borderColor: 'rgba(244,180,26,0.3)', color: '#F4B41A' }}>
            ✦ Form Order Service
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Mulai Project
            <span className="block italic text-shimmer">Anda Hari Ini</span>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Isi form di bawah dan tim kami akan menghubungi Anda dalam kurang dari 5 menit.
          </p>
        </div>
      </div>

      {/* Form */}
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      }>
        <OrderForm />
      </Suspense>
    </div>
  )
}
