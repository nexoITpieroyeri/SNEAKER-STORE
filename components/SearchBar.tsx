'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SearchResult {
  id: string
  name: string
  slug: string
  brand_name: string
  final_price: number
  image_url: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          final_price,
          brand:brands(name),
          images:product_images(image_url)
        `)
        .ilike('name', `%${query}%`)
        .eq('status', 'published')
        .limit(5)

      setResults((data || []).map((p: unknown) => {
        const product = p as { id: string; name: string; slug: string; final_price: number; brand: { name: string }; images: { image_url: string }[] }
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          final_price: product.final_price,
          brand_name: product.brand.name,
          image_url: product.images?.[0]?.image_url || '',
        }
      }))
      setLoading(false)
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Buscar..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && (
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {results.map((result) => (
            <a
              key={result.id}
              href={`/producto/${result.slug}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
            >
              <img src={result.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{result.name}</p>
                <p className="text-xs text-gray-500">{result.brand_name}</p>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${result.final_price.toLocaleString()}
              </span>
            </a>
          ))}
          <a
            href={`/catalogo?search=${encodeURIComponent(query)}`}
            className="block p-3 text-center text-sm text-gray-600 hover:bg-gray-50 border-t border-gray-100"
          >
            Ver todos los resultados para "{query}"
          </a>
        </div>
      )}
    </div>
  )
}
