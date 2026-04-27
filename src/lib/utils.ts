export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRupiahShort(amount: number): string {
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`
  if (amount >= 1_000) return `Rp ${Math.round(amount / 1_000)}rb`
  return `Rp ${amount}`
}

export function generateOrderId(): string {
  const now = new Date()
  const d = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const r = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `TD-${d}-${r}`
}

export function formatWANumber(wa: string): string {
  let clean = wa.replace(/\D/g, '')
  if (clean.startsWith('0')) clean = '62' + clean.slice(1)
  else if (!clean.startsWith('62')) clean = '62' + clean
  return clean
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
