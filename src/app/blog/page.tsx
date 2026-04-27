'use client' // Tambahkan ini karena kita akan menggunakan useEffect & useState

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase' // Pastikan path ke supabase client sudah benar
import FloatingWA from '@/components/FloatingWA'

// Tipe data sesuai dengan SQL yang kita buat
interface Post {
  id: number
  title: string
  slug: string
  category: string
  read_time: string
  excerpt: string
  is_published: boolean
}

const CAT_COLOR: Record<string, string> = {
  Growth: 'text-amber-700 bg-amber-50',
  Creative: 'text-rose-700 bg-rose-50',
  Enterprise: 'text-cyan-700 bg-cyan-50',
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true) // Hanya ambil yang sudah dipublikasi
        .order('created_at', { ascending: false })

      if (!error && data) setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="section-label mb-6 inline-flex" style={{ background: "rgba(244,180,26,0.1)", borderColor: "rgba(244,180,26,0.3)", color: "#F4B41A" }}>
            Blog & Insights
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Tips & Tutorial
            <span className="block italic text-shimmer">Dunia Digital</span>
          </h1>
          <p className="text-white/50">Artikel praktis seputar branding, desain, dan strategi digital dari tim Tugasin Digital.</p>
        </div>
      </div>

      {/* Blog List Section */}
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-16 space-y-6">
        {loading ? (
          // Loading Indicator
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-white rounded-2xl border border-platinum/60 group-hover:border-navy/20 group-hover:shadow-luxury p-6 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " + (CAT_COLOR[post.category] || "text-navy/50 bg-navy/5")}>
                    {post.category}
                  </span>
                  <span className="text-navy/35 text-xs">{post.read_time} read</span>
                </div>
                <h2 className="font-display text-xl font-semibold text-navy mb-2 group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
                <p className="text-navy/55 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-navy/40 text-sm group-hover:text-navy transition-colors">
                  Baca selengkapnya
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </article>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 text-navy/35">
            <p>Belum ada artikel yang dipublikasikan.</p>
          </div>
        )}

        <p className="text-center text-navy/30 text-sm pt-4">Artikel lebih banyak segera hadir — stay tuned!</p>
      </div>
      
      <FloatingWA />
    </div>
  )
}