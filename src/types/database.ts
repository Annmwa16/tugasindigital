export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: number
          order_id: string
          customer_name: string
          whatsapp: string
          service_name: string
          detail_request: string | null
          deadline: string | null
          price: number | null
          status: OrderStatus
          payment_status: PaymentStatus
          file_urls: string | null
          result_files: string | null
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      services: {
        Row: {
          id: number
          service_name: string
          category: string
          pillar: PillarType
          description: string | null
          price_min: number
          price_max: number
          icon: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      testimonials: {
        Row: {
          id: number
          name: string
          role: string | null
          content: string
          rating: number
          foto_url: string | null
          service_name: string | null
          is_published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
      }
      portofolio: {
        Row: {
          id: number
          judul: string
          kategori: string
          deskripsi: string | null
          foto_url: string | null
          published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['portofolio']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['portofolio']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type OrderStatus = 'Baru' | 'Proses' | 'Pelunasan' | 'Selesai' | 'Revisi' | 'Dibatalkan'
export type PaymentStatus = 'Belum Bayar' | 'DP 50%' | 'Lunas'
export type PillarType = 'face' | 'brain' | 'backbone'

export type Order       = Database['public']['Tables']['orders']['Row']
export type Service     = Database['public']['Tables']['services']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type Portfolio   = Database['public']['Tables']['portofolio']['Row']