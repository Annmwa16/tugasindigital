// src/types/index.ts
// ─── DATABASE TYPES ───────────────────────────────────────────────────────────

export interface Order {
  id: number;
  order_id: string;            // e.g. "TD-20260423-001"
  customer_name: string;
  customer_wa: string;
  customer_email?: string;
  service_name: string;
  category: string;
  description: string;
  deadline?: string;
  price?: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  file_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export type OrderStatus =
  | "Baru"
  | "In Progress"
  | "Review"
  | "Selesai";

export type PaymentStatus =
  | "Belum Bayar"
  | "DP 50%"
  | "Lunas";

export interface Service {
  id: number;
  service_name: string;
  category: string;
  description?: string;
  price_min: number;
  price_max: number;
  is_active: boolean;
  icon?: string;
  pillar: "Creative" | "Growth" | "Technical";
}

export interface Testimonial {
  id: number;
  customer_name: string;
  service_name: string;
  rating: number;          // 1-5
  message: string;
  avatar_url?: string;
  approved: boolean;
  created_at: string;
}

export interface Portfolio {
  id: number;
  title: string;
  category: string;
  image_url: string;
  description?: string;
  client_name?: string;
  created_at: string;
}

// ─── FORM TYPES ───────────────────────────────────────────────────────────────

export interface OrderFormData {
  customer_name: string;
  customer_wa: string;
  customer_email?: string;
  service_name: string;
  description: string;
  deadline?: string;
  price?: number;
}

// ─── UI TYPES ─────────────────────────────────────────────────────────────────

export type PillarFilter = "Semua" | "Creative" | "Growth" | "Technical";

export interface ServiceCard extends Service {
  pillarLabel: string;
  pillarColor: string;
}
