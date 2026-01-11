'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ProductWithDetails } from '@/lib/supabase/types'

interface ProductCardProps {
  product: ProductWithDetails
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0
  const isNew = product.created_at && isNewArrival(product.created_at)

  const mainImage = product.images.find(img => img.display_order === 1)?.image_url 
    || product.images[0]?.image_url
    || '/placeholder.jpg'

  return (
    <Link 
      href={`/producto/${product.slug}`}
      className="group relative block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {isNew && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            NUEVO
          </span>
        )}
        
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            -{product.discount_percentage}%
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.brand.name}</p>
        
        <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-red-500">
                ${product.final_price.toLocaleString('es-MX')}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${product.base_price.toLocaleString('es-MX')}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              ${product.final_price.toLocaleString('es-MX')}
            </span>
          )}
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((size) => (
              <span 
                key={size.id}
                className={`text-xs px-2 py-1 rounded border ${
                  size.is_available 
                    ? 'bg-gray-50 border-gray-200 text-gray-700' 
                    : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                }`}
              >
                {size.size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs px-2 py-1 text-gray-500">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function isNewArrival(createdAt: string, daysThreshold: number = 14): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - created.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= daysThreshold
}
