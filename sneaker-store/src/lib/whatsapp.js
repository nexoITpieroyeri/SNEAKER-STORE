import { supabase } from './supabase'

let cachedSettings = null

export async function getWhatsAppSettings() {
  if (cachedSettings) return cachedSettings
  
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('whatsapp_number, site_name')
      .eq('id', 'default')
      .single()
    
    cachedSettings = data || { whatsapp_number: '521234567890', site_name: 'Sneaker Store' }
    return cachedSettings
  } catch (err) {
    console.error('Error loading WhatsApp settings:', err)
    return { whatsapp_number: '521234567890', site_name: 'Sneaker Store' }
  }
}

export function clearWhatsAppCache() {
  cachedSettings = null
}

export function generateWhatsAppMessage({ 
  product, 
  selectedSize, 
  quantity = 1,
  customerName = '',
  type = 'inquiry'
}) {
  const siteName = 'Sneaker Store'
  
  if (type === 'inquiry') {
    if (product && selectedSize) {
      return `¡Hola! Me interesa el siguiente producto de ${siteName}:

📦 *Producto:* ${product.name}
👟 *Talla:* ${selectedSize}
📏 *Cantidad:* ${quantity}
💰 *Precio:* $${(product.final_price || product.base_price).toLocaleString('es-PE')} PEN

¿Está disponible en esta talla? ¿Cuáles son los métodos de pago y tiempo de entrega?

¡Gracias!`
    } else if (product) {
      return `¡Hola! Me interesa el siguiente producto de ${siteName}:

📦 *Producto:* ${product.name}
💰 *Precio:* $${(product.final_price || product.base_price).toLocaleString('es-PE')} PEN

¿Tienes más colores/tallas disponibles? ¿Está nuevo con caja?

¡Gracias!`
    }
  }
  
  if (type === 'order') {
    return `¡Hola! Quiero realizar el siguiente pedido en ${siteName}:

📦 *Producto:* ${product.name}
👟 *Talla:* ${selectedSize}
📏 *Cantidad:* ${quantity}
💰 *Precio:* $${(product.final_price || product.base_price).toLocaleString('es-PE')} PEN
💵 *Total:* $${((product.final_price || product.base_price) * quantity).toLocaleString('es-PE')} PEN

📛 *Nombre:* ${customerName || '[Tu Nombre]'}

¿Qué métodos de pago aceptan? ¿Confirman disponibilidad?

¡Gracias!`
  }
  
  if (type === 'cart') {
    const items = Array.isArray(product) ? product : []
    let message = `¡Hola! Quiero realizar el siguiente pedido en ${siteName}:\n\n`
    
    let subtotal = 0
    items.forEach((item, index) => {
      const price = item.final_price || item.base_price
      const itemTotal = price * (item.quantity || 1)
      subtotal += itemTotal
      
      message += `${index + 1}. *${item.name}*\n`
      message += `   👟 Talla: ${item.selectedSize || 'Sin especificar'}\n`
      message += `   📏 Cantidad: ${item.quantity || 1}\n`
      message += `   💰 Precio: $${price.toLocaleString('es-PE')} PEN\n\n`
    })
    
    message += `💵 *Total del pedido:* $${subtotal.toLocaleString('es-PE')} PEN`
    message += `\n📛 *Nombre:* ${customerName || '[Tu Nombre]'}`
    message += `\n\n¿Qué métodos de pago aceptan? ¿Confirman disponibilidad?\n\n¡Gracias!`
    
    return message
  }
  
  return `¡Hola! Me interesa obtener más información sobre los productos de ${siteName}. ¿Podrían orientarme?

¡Gracias!`
}

export function openWhatsApp(message, phoneNumber) {
  const cleanNumber = phoneNumber?.replace(/\D/g, '') || '521234567890'
  const encodedMessage = encodeURIComponent(message)
  const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`
  window.open(url, '_blank')
}

export async function handleWhatsAppClick({ 
  product, 
  selectedSize, 
  quantity = 1,
  customerName = '',
  type = 'inquiry'
}) {
  const settings = await getWhatsAppSettings()
  const message = generateWhatsAppMessage({ 
    product, 
    selectedSize, 
    quantity,
    customerName,
    type
  })
  openWhatsApp(message, settings.whatsapp_number)
  
  await trackWhatsAppClick()
  
  return { message, phoneNumber: settings.whatsapp_number }
}

async function trackWhatsAppClick() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing } = await supabase
      .from('analytics')
      .select('id, whatsapp_queries')
      .eq('date', today)
      .single()
    
    if (existing) {
      await supabase
        .from('analytics')
        .update({ 
          whatsapp_queries: (existing.whatsapp_queries || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('analytics')
        .insert({
          date: today,
          visits: 0,
          whatsapp_queries: 1
        })
    }
  } catch (err) {
    console.error('Error tracking WhatsApp click:', err)
  }
}
