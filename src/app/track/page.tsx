import { Suspense } from 'react'
import TrackOrder from '@/components/TrackOrder'

export const metadata = { title: 'Cek Status Order | Tugasin Digital' }

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-platinum/20">
      <div className="bg-navy py-20 pt-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-8 text-center">
          <div className="section-label mb-5 inline-flex" style={{ background: 'rgba(244,180,26,0.1)', borderColor: 'rgba(244,180,26,0.3)', color: '#F4B41A' }}>
            ✦ Real-time Tracking
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Status Order
            <span className="block italic text-shimmer">Real-time</span>
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Masukkan ID Order untuk melihat progress pengerjaan project Anda.
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      }>
        <TrackOrder />
      </Suspense>
    </div>
  )
}
