import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingWA from '@/components/FloatingWA'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Tugasin Digital — Premium Digital Agency',
    template: '%s | Tugasin Digital',
  },
  description: 'Agency digital premium dengan empat pilar: Creative, Growth, Enterprise, dan Joki Akademik.',
  keywords: ['jasa digital', 'agency digital', 'branding', 'web development', 'joki tugas', 'tugasin digital'],
  openGraph: {
    title: 'Tugasin Digital',
    description: 'Transformasi digital bisnis Anda dengan solusi premium.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingWA />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A2540',
              color: '#E5E4E2',
              border: '1px solid rgba(244,180,26,0.25)',
              borderRadius: '10px',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#F4B41A', secondary: '#1A2540' } },
          }}
        />
      </body>
    </html>
  )
}