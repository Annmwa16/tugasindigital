'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getPost() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', params.slug)
        .single()
      
      setPost(data)
      setLoading(false)
    }
    getPost()
  }, [params.slug, supabase])

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center text-white">Loading...</div>
  if (!post) return notFound()

  // Paksa tipe data 'any' biar TypeScript nggak rewel soal 'category'
  const article = post as any;

  return (
    <div className="min-h-screen bg-white">
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
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-20">
        <div 
          className="prose prose-lg prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  )
}
