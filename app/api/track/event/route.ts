import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = createClient()
  const { productId, metadata } = await request.json()

  await supabase.from('analytics_events').insert({
    event_type: metadata?.eventType || 'whatsapp_click',
    product_id: productId,
    metadata,
  })

  if (metadata?.eventType === 'whatsapp_click') {
    await supabase
      .from('products')
      .update({ whatsapp_clicks: supabase.raw('whatsapp_clicks + 1') })
      .eq('id', productId)
  }

  revalidatePath('/admin')

  return new Response('OK', { status: 200 })
}
