import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import FloatingWA from '@/components/FloatingWA'

// Fungsi untuk mengambil data artikel berdasarkan slug
async function getPost(slug: string) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  
  return post
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

 // Jika artikel tidak ditemukan di database, tampilkan halaman 404
  if (!post) {
    notFound()
  }

  // Tambahkan baris sakti ini biar TypeScript diem
  const article = post as any;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Artikel */}
      <div className="bg-navy pt-32 pb-20 relative">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div className="text-gold mb-4 text-xs font-semibold uppercase tracking-[0.2em]">
            {article.category} • {article.read_time} Read
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-white/50 text-lg leading-relaxed italic max-w-2xl mx-auto">
              "{article.excerpt}"
            </p>
          )}
        </div>
      </div>

      {/* Isi Konten */}
      <article className="max-w-3xl mx-auto px-5 md:px-8 py-16">
        <div className="prose prose-lg max-w-none text-navy/80 leading-relaxed">
          {/* FIX: Menambahkan 'break-words' untuk menangani teks tanpa spasi 
            dan 'whitespace-pre-wrap' untuk menjaga format paragraf.
          */}
          <div className="whitespace-pre-wrap break-words overflow-hidden w-full">
            {article.content}
          </div>
        </div>
        
        {/* Footer Artikel / Navigasi Balik */}
        <div className="mt-16 pt-8 border-t border-platinum/60">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gold hover:text-navy transition-all duration-300 font-medium group"
          >
            <svg 
              className="transform group-hover:-translate-x-1 transition-transform" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Kembali ke Blog
          </Link>
        </div>
      </article>

      <FloatingWA />
    </div>
  )
}
