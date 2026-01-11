'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ProductWithDetails } from '@/lib/supabase/types'

async function fetchProducts(): Promise<ProductWithDetails[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    throw new Error(error.message)
  }

  return data as unknown as ProductWithDetails[]
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchProducts,
  })
}
