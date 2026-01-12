'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductWithDetails } from '@/lib/supabase/types'
import { ProductCard } from '@/components/ProductCard'
import { LoadingSpinner } from '@/components/ui/primitives'
import { generateWhatsAppLink } from '@/lib/utils/whatsapp'

export default function ProductGrid({ 
  initialProducts, 
  title 
}: { 
  initialProducts: ProductWithDetails[] | null
  title?: string
}) {
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts || [])
  const [loading, setLoading] = useState(!initialProducts)

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts()
    }
  }, [initialProducts])

  const fetchProducts = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        images:product_images(*),
        sizes:product_sizes(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(8)

    setProducts((data || []) as unknown as ProductWithDetails[])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
