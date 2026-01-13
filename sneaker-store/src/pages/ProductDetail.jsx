import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MessageCircle, Check, X, Truck, Shield, Package } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useCartStore } from '../store/favoritesStore'
import { handleWhatsAppClick, clearWhatsAppCache } from '../lib/whatsapp'
import { supabase } from '../lib/supabase'

export function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToFavorites, removeFromFavorites, isFavorite } = useCartStore()

  useEffect(() => {
    clearWhatsAppCache()
    
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
          const sizesWithStock = data.product_sizes?.map(s => ({
            size: s.size,
            stock_quantity: s.stock_quantity,
            is_available: s.stock_quantity > 0
          })) || []

          setProduct({
            ...data,
            images: data.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [],
            sizes: sizesWithStock,
            has_stock: sizesWithStock.some(s => s.is_available)
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
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price || 0)
  }

  const favorite = product ? isFavorite(product.id) : false

  const getStockForSize = (size) => {
    return product?.sizes?.find(s => s.size === size)?.stock_quantity || 0
  }

  const handleWhatsApp = async () => {
    if (!product) return

    await handleWhatsAppClick({
      product: {
        id: product.id,
        name: product.name,
        base_price: product.base_price,
        final_price: product.final_price || product.base_price,
        sku: product.sku
      },
      selectedSize: selectedSize || 'Sin especificar',
      quantity,
      type: selectedSize ? 'inquiry' : 'general'
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Mira este producto: ${product.name}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-6xl mx-auto">
          <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-gray-500 mb-8">El producto que buscas no existe o ha sido eliminado.</p>
          <Link to="/catalogo">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Ver catálogo completo
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link 
          to="/catalogo" 
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              {product.images[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-300" />
                </div>
              )}

              {product.discount_percentage > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-full">
                  -{product.discount_percentage}% OFF
                </div>
              )}

              {!product.has_stock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-3 text-xl font-bold rounded-lg">
                    AGOTADO
                  </span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Link 
                to={`/catalogo?brand=${product.brand?.slug}`}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wide"
              >
                {product.brand?.name}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-4">
              {product.discount_percentage > 0 ? (
                <>
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPrice(product.final_price || product.base_price)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.base_price)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                    Ahorra {formatPrice(product.base_price - (product.final_price || product.base_price))}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.base_price)}
                </span>
              )}
            </div>

            {product.sku && (
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                product.gender === 'men' ? 'bg-blue-100 text-blue-700' :
                product.gender === 'women' ? 'bg-pink-100 text-pink-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {product.gender === 'unisex' ? 'Unisex' : product.gender}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                {product.category?.replace(/_/g, ' ')}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                {product.condition?.replace(/_/g, ' ').replace('with box', 'con caja')}
              </span>
              {product.is_limited && (
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                  Edicion Limitada
                </span>
              )}
            </div>

            {product.has_stock ? (
              <Card className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Selecciona tu talla</h3>
                    {selectedSize && (
                      <span className="text-sm text-green-600 font-medium">
                        Talla seleccionada: {selectedSize}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size, index) => {
                      const stock = size.stock_quantity
                      const isSelected = selectedSize === size.size
                      
                      return (
                        <button
                          key={index}
                          onClick={() => size.is_available && setSelectedSize(size.size)}
                          disabled={!size.is_available}
                          className={`
                            relative py-3 px-2 rounded-lg text-sm font-medium transition-all
                            ${isSelected 
                              ? 'bg-blue-600 text-white shadow-lg scale-105' 
                              : size.is_available
                                ? 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                                : 'bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed line-through'
                            }
                          `}
                        >
                          {size.size}
                          {size.is_available && stock <= 3 && stock > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">
                              !
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {selectedSize && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 text-sm">
                        {getStockForSize(selectedSize)} unidades disponibles
                      </span>
                    </div>
                  )}

                  {!product.sizes?.length && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Este producto no tiene tallas disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <X className="h-5 w-5" />
                  <span className="font-medium">Producto agotado</span>
                </div>
                <p className="text-sm text-red-500 mt-1">
                  Consulta por disponibilidad y próximas lluvias
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="flex-1 gap-2 bg-green-500 hover:bg-green-600 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                disabled={!product.has_stock}
              >
                <MessageCircle className="h-5 w-5" />
                {selectedSize ? 'Consultar disponibilidad' : 'Preguntar por este producto'}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => favorite ? removeFromFavorites(product.id) : addToFavorites(product)}
                className={`px-4 ${favorite ? 'border-red-500 text-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="px-4"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Envío rápido</p>
                  <p className="text-xs text-gray-500">2-5 días hábiles</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">100% Original</p>
                  <p className="text-xs text-gray-500">Productos garantizados</p>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="border-t pt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Condición:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">
                  {product.condition?.replace(/_/g, ' ').replace('with box', 'Nuevo con caja')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Categoría:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">
                  {product.category?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
