import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface AnalyticsData {
  totalViews: number
  totalWhatsAppClicks: number
  totalProducts: number
  topProducts: Array<{
    id: string
    name: string
    view_count: number
    whatsapp_clicks: number
  }>
  recentViews: Array<{
    id: string
    product_id: string
    viewed_at: string
  }>
  viewsByDay: Array<{
    date: string
    count: number
  }>
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const supabase = createClient()

  const { count: totalViews } = await supabase
    .from('product_views')
    .select('*', { count: 'exact', head: true })

  const { count: totalWhatsAppClicks } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'whatsapp_click')

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { data: topProducts } = await supabase
    .from('products')
    .select('id, name, view_count, whatsapp_clicks')
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(10)

  const { data: recentViews } = await supabase
    .from('product_views')
    .select('id, product_id, viewed_at')
    .order('viewed_at', { ascending: false })
    .limit(20)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: viewsThisWeek } = await supabase
    .from('product_views')
    .select('viewed_at')
    .gte('viewed_at', sevenDaysAgo.toISOString())

  const viewsByDay: AnalyticsData['viewsByDay'] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const count = viewsThisWeek?.filter((v: any) => 
      v.viewed_at.split('T')[0] === dateStr
    ).length || 0
    viewsByDay.push({ date: dateStr, count })
  }

  return {
    totalViews: totalViews || 0,
    totalWhatsAppClicks: totalWhatsAppClicks || 0,
    totalProducts: totalProducts || 0,
    topProducts: (topProducts as any) || [],
    recentViews: (recentViews as any) || [],
    viewsByDay,
  }
}

export async function trackProductView(productId: string, userIp?: string) {
  const supabase = createClient()

  await supabase.from('product_views').insert({
    product_id: productId,
    user_ip: userIp,
  } as any)

  await supabase.rpc('increment_view_count', { product_id: productId } as any)

  revalidatePath(`/producto/*`)
}

export async function trackAnalyticsEvent(
  eventType: string,
  productId?: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createClient()

  await supabase.from('analytics_events').insert({
    event_type: eventType,
    product_id: productId,
    metadata,
  } as any)

  if (eventType === 'whatsapp_click' && productId) {
    await supabase.rpc('increment_whatsapp_clicks', { product_id: productId } as any)
  }

  revalidatePath('/admin')
}
