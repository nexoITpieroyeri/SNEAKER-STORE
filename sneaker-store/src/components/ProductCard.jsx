import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { Button } from './ui/Button'
import { useCartStore } from '../store/favoritesStore'

export function ProductCard({ product }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useCartStore()
  const favorite = isFavorite(product.id)

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price || 0)
  }

  const hasDiscount = product.discount_percentage > 0
  const finalPrice = product.final_price || product.base_price || 0
  const originalPrice = product.base_price || 0

  const imageUrl = product.images?.[0]?.url || product.images?.[0]?.image_url || null

  return (
    <Link 
      to={`/producto/${product.slug}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            -{product.discount_percentage}%
          </div>
        )}

        {!product.has_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold rounded">
              Agotado
            </span>
          </div>
        )}

        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            favorite 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 text-slate-400 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
            Ver producto
          </Button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          {product.brand?.name}
        </p>
        <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                {s.size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="px-2 py-0.5 text-slate-400 text-xs">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
