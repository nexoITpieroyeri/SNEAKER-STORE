import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MessageCircle, Check, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useCartStore } from '../store/favoritesStore'
import { WHATSAPP_NUMBER } from '../lib/config'

const mockProduct = {
  id: 1,
  name: 'Nike Dunk Low "Panda"',
  slug: 'nike-dunk-low-panda',
  description: 'Las Nike Dunk Low "Panda" son un clásico absoluto que combina versatilidad y estilo. Con su combinación de colores hitam y blanco, son perfectas para cualquier outfit. Originalmente diseñadas para la cancha de baloncesto, hoy son un ícono de la cultura sneaker.',
  base_price: 2500,
  final_price: 2500,
  discount_percentage: 0,
  gender: 'unisex',
  category: 'casual',
  condition: 'new_with_box',
  brand: { id: 1, name: 'Nike', slug: 'nike' },
  sku: 'DD1391-100',
  images: [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800', display_order: 1 },
    { id: 2, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', display_order: 2 },
    { id: 3, image_url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800', display_order: 3 },
    { id: 4, image_url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800', display_order: 4 },
  ],
  sizes: [
    { id: 1, size: 'US 8', stock_quantity: 2, is_available: true },
    { id: 2, size: 'US 8.5', stock_quantity: 0, is_available: false },
    { id: 3, size: 'US 9', stock_quantity: 1, is_available: true },
    { id: 4, size: 'US 9.5', stock_quantity: 3, is_available: true },
    { id: 5, size: 'US 10', stock_quantity: 0, is_available: false },
    { id: 6, size: 'US 10.5', stock_quantity: 2, is_available: true },
    { id: 7, size: 'US 11', stock_quantity: 1, is_available: true },
  ]
}

export function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToFavorites, removeFromFavorites, isFavorite } = useCartStore()

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setProduct(mockProduct)
      setLoading(false)
    }
    fetchProduct()
  }, [slug])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  const favorite = product ? isFavorite(product.id) : false

  const handleWhatsApp = () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    const message = encodeURIComponent(
      `¡Hola! Me interesa este producto:\n\n👟 ${product.name}\n📏 Talla: ${selectedSize}\n💰 Precio: ${formatPrice(product.final_price)}\n🔗 ${window.location.href}\n\n¿Está disponible?`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link to="/catalogo">
          <Button>Volver al catálogo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/catalogo" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-2" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.images[selectedImage]?.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={image.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground uppercase">{product.brand.name}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            {product.discount_percentage > 0 ? (
              <>
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.final_price)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.base_price)}
                </span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                  -{product.discount_percentage}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                {formatPrice(product.base_price)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">SKU: {product.sku}</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-muted rounded capitalize">{product.gender}</span>
              <span className="text-xs px-2 py-1 bg-muted rounded capitalize">{product.category.replace('_', ' ')}</span>
              <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
                {product.condition.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Selecciona tu talla</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size.id}
                    onClick={() => size.is_available && setSelectedSize(size.size)}
                    disabled={!size.is_available}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === size.size
                        ? 'bg-primary text-primary-foreground'
                        : size.is_available
                        ? 'bg-muted hover:bg-muted/80'
                        : 'bg-muted/50 text-muted-foreground cursor-not-allowed line-through'
                    }`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
              {!product.sizes.some(s => s.is_available) && (
                <p className="text-sm text-red-500 mt-2">Todas las tallas agotadas</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
              disabled={!selectedSize || !product.sizes.find(s => s.size === selectedSize)?.is_available}
            >
              <MessageCircle className="h-5 w-5" />
              Consultar por WhatsApp
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => favorite ? removeFromFavorites(product.id) : addToFavorites(product)}
            >
              <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="border-t mt-6 pt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Estado:</span>
              <span className="ml-2 font-medium capitalize">{product.condition.replace(/_/g, ' ')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">SKU:</span>
              <span className="ml-2 font-medium">{product.sku}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
