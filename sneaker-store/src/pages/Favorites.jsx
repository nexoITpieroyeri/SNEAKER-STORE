import { Link } from 'react-router-dom'
import { Heart, ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useCartStore } from '../store/favoritesStore'

export function FavoritesPage() {
  const { favorites, removeFromFavorites } = useCartStore()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No tienes favoritos aún</h1>
        <p className="text-muted-foreground mb-6">
          Guarda los productos que te interesan para verlos después
        </p>
        <Link to="/catalogo">
          <Button>Ver catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/catalogo" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Volver al catálogo
      </Link>

      <h1 className="text-3xl font-bold mb-8">Mis favoritos ({favorites.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map(product => (
          <Card key={product.id} className="group overflow-hidden">
            <Link to={`/producto/${product.slug}`}>
              <div className="aspect-square overflow-hidden bg-muted">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    Sin imagen
                  </div>
                )}
              </div>
            </Link>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">{product.brand?.name}</p>
                  <Link to={`/producto/${product.slug}`}>
                    <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromFavorites(product.id)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="mt-2">
                <span className="text-lg font-bold">
                  {formatPrice(product.final_price || product.base_price)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
