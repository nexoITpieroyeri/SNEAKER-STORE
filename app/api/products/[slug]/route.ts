import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  return NextResponse.json(product)
}
