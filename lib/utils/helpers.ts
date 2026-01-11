import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 7) {
    return formatDate(date)
  } else if (diffDays > 0) {
    return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  } else if (diffHours > 0) {
    return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  } else if (diffMins > 0) {
    return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  } else {
    return 'hace un momento'
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateSKU(brand: string, productName: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase()
  const productCode = productName
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 5)
    .toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${brandCode}-${productCode}-${random}`
}
