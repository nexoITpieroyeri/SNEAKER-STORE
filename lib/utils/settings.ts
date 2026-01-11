import { createClient } from '@/lib/supabase/server'

export async function getSiteSettings() {
  const supabase = createClient()
  
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')

  const settings: Record<string, unknown> = {}
  data?.forEach(item => {
    settings[item.key] = item.value
  })

  return settings
}

export async function getWhatsAppNumber(): Promise<string> {
  const settings = await getSiteSettings()
  return (settings.whatsapp_number as string) || ''
}

export async function getBusinessName(): Promise<string> {
  const settings = await getSiteSettings()
  return (settings.business_name as string) || 'Sneaker Store'
}
