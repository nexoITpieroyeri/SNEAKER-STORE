import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useCartStore } from '../store/favoritesStore'
import { handleWhatsAppClick } from '../lib/whatsapp'
import { supabase } from '../lib/supabase'

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
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            brand:brands(name, slug),
            product_images(url, alt_text, sort_order, is_primary),
            product_sizes(size, stock_quantity)
          `)
          .eq('slug', slug)
          .single()

        if (error || !data) {
          setProduct(null)
        } else {
          setProduct({
            ...data,
            images: data.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [],
            sizes: data.product_sizes?.map(s => ({
              ...s,
              is_available: s.stock_quantity > 0
            })) || []
          })
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setProduct(null)
      }
      setLoading(false)
    }

    fetchProduct()
  }, [slug])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price || 0)
  }

  const favorite = product ? isFavorite(product.id) : false

  const handleWhatsApp = async () => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla')
      return
    }

    await handleWhatsAppClick({
      product: {
        id: product.id,
        name: product.name,
        base_price: product.base_price,
        final_price: product.final_price || product.base_price,
        sku: product.sku
      },
      selectedSize,
      quantity: 1,
      type: 'inquiry'
    })
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
              src={product.images[selectedImage]?.url || 'https://via.placeholder.com/800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={image.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {product.images.length === 0 && (
              <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Sin imagen</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground uppercase">{product.brand?.name}</span>
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
            {product.sku && <p className="text-sm text-muted-foreground mb-3">SKU: {product.sku}</p>}
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 bg-muted rounded capitalize">{product.gender}</span>
              <span className="text-xs px-2 py-1 bg-muted rounded capitalize">{product.category?.replace('_', ' ')}</span>
              <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
                {product.condition?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Selecciona tu talla</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
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
              {(!product.sizes || product.sizes.length === 0) && (
                <p className="text-sm text-slate-500 mt-2">No hay tallas disponibles</p>
              )}
              {product.sizes && !product.sizes.some(s => s.is_available) && (
                <p className="text-sm text-red-500 mt-2">Todas las tallas agotadas</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
              disabled={!selectedSize || !product.sizes?.find(s => s.size === selectedSize)?.is_available}
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
              <span className="ml-2 font-medium capitalize">{product.condition?.replace(/_/g, ' ')}</span>
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
