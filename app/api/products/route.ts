import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
    `)
    .eq('status', 'published')

  const search = searchParams.get('search')
  const brand = searchParams.get('brand')
  const gender = searchParams.get('gender')
  const category = searchParams.get('category')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const sort = searchParams.get('sort') || 'newest'
  const limit = searchParams.get('limit') || '12'
  const offset = searchParams.get('offset') || '0'

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (brand) {
    query = query.eq('brand.slug', brand)
  }

  if (gender) {
    query = query.eq('gender', gender)
  }

  if (category) {
    query = query.eq('category', category)
  }

  if (minPrice) {
    query = query.gte('final_price', parseFloat(minPrice))
  }

  if (maxPrice) {
    query = query.lte('final_price', parseFloat(maxPrice))
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('final_price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('final_price', { ascending: false })
      break
    case 'popular':
      query = query.order('view_count', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    count,
    limit: parseInt(limit),
    offset: parseInt(offset),
  })
}
