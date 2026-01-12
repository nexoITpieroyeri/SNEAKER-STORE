import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = createClient()

  await supabase
    .from('product_views')
    .insert({ product_id: slug } as any)

  await supabase.rpc('increment_view_count', { product_id: slug } as any)

  revalidatePath(`/producto/${slug}`)

  return new Response('OK', { status: 200 })
}
