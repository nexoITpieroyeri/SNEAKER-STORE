'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductWithDetails } from '@/lib/supabase/types'
import { ProductCard } from '@/components/ProductCard'
import { LoadingSpinner } from '@/components/ui/primitives'

export default function FavoritesPage() {
  const supabase = createClient()
  const [favorites, setFavorites] = useState<string[]>([])
  const [products, setProducts] = useState<ProductWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      const ids = JSON.parse(saved)
      setFavorites(ids)
      fetchProducts(ids)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProducts = async (ids: string[]) => {
    if (ids.length === 0) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        images:product_images(*),
        sizes:product_sizes(*)
      `)
      .in('id', ids)
      .eq('status', 'published')

    if (error) {
      console.error('Error fetching favorites:', error)
    } else {
      setProducts(data as unknown as ProductWithDetails[])
    }
    setLoading(false)
  }

  const removeFavorite = (productId: string) => {
    const newFavorites = favorites.filter((id) => id !== productId)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setProducts(products.filter((p) => p.id !== productId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Favoritos</h1>
        <p className="text-gray-600 mb-8">
          {favorites.length} productos guardados
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes favoritos aún</h2>
            <p className="text-gray-500 mb-6">Guarda los productos que te interesen para verlos aquí</p>
            <a
              href="/catalogo"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ver Catálogo
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
