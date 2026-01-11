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
    .insert({
      product_id: slug,
    })

  await supabase
    .from('products')
    .update({ view_count: supabase.raw('view_count + 1') })
    .eq('id', slug)

  revalidatePath(`/producto/${slug}`)

  return new Response('OK', { status: 200 })
}
