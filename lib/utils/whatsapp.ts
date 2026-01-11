import { Product } from '@/lib/supabase/types'

export function generateWhatsAppLink(
  product: Pick<Product, 'name' | 'slug' | 'final_price'>,
  size: string,
  phoneNumber: string
): string {
  const baseUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`
  
  const message = `
👟 *${product.name}*
📏 Talla: *${size}*
💰 Precio: *$${product.final_price.toLocaleString('es-MX')} MXN*
🔗 Ver producto: ${process.env.NEXT_PUBLIC_APP_URL}/producto/${product.slug}

¿Está disponible para compra?
  `.trim()

  return `${baseUrl}?text=${encodeURIComponent(message)}`
}

export function generateWhatsAppMessage(
  product: Pick<Product, 'name' | 'slug' | 'final_price'>,
  size: string
): string {
  return `
👟 *${product.name}*
📏 Talla: *${size}*
💰 Precio: *$${product.final_price.toLocaleString('es-MX')} MXN*
🔗 Ver producto: ${process.env.NEXT_PUBLIC_APP_URL}/producto/${product.slug}

¿Está disponible para compra?
  `.trim()
}

export function isValidWhatsAppNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function formatWhatsAppNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '')
  if (cleaned.startsWith('52')) {
    return cleaned
  }
  return `52${cleaned}`
}
