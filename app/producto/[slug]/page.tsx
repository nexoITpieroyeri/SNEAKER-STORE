import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductWithDetails } from '@/lib/supabase/types'
import { generateWhatsAppLink } from '@/lib/utils/whatsapp'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string): Promise<ProductWithDetails | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return null
  }

  return data as unknown as ProductWithDetails
}

async function getRelatedProducts(
  brandId: string, 
  category: string, 
  currentId: string
): Promise<ProductWithDetails[]> {
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
    .eq('brand_id', brandId)
    .neq('id', currentId)
    .limit(4)

  return (data || []) as unknown as ProductWithDetails[]
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return {
      title: 'Producto no encontrado'
    }
  }

  return {
    title: `${product.name} | Sneaker Store`,
    description: product.meta_description || `Compra ${product.name} en Sneaker Store. ${product.brand.name} - ${product.category}`,
    openGraph: {
      title: product.name,
      description: product.meta_description || '',
      images: product.images[0]?.image_url ? [product.images[0].image_url] : [],
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  const relatedProducts = await getRelatedProducts(
    product.brand_id, 
    product.category, 
    product.id
  )

  const sortedImages = [...product.images].sort((a, b) => a.display_order - b.display_order)
  const availableSizes = product.sizes.filter(s => s.is_available)
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-black">Inicio</Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo" className="hover:text-black">Catálogo</Link>
          <span className="mx-2">/</span>
          <Link href={`/catalogo?brand=${product.brand.slug}`} className="hover:text-black">
            {product.brand.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
              <Image
                src={sortedImages[0]?.image_url || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{product.discount_percentage}% OFF
                </span>
              )}
            </div>
            
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {sortedImages.slice(0, 4).map((image, index) => (
                  <button
                    key={image.id}
                    className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 border-transparent hover:border-black transition-colors"
                  >
                    <Image
                      src={image.image_url}
                      alt={`${product.name} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Link 
                href={`/catalogo?brand=${product.brand.slug}`}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                {product.brand.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-red-500">
                    ${product.final_price.toLocaleString('es-MX')}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.base_price.toLocaleString('es-MX')}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ${product.final_price.toLocaleString('es-MX')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {getGenderLabel(product.gender)}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {getCategoryLabel(product.category)}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {getConditionLabel(product.condition)}
              </span>
            </div>

            {product.description && (
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Selecciona tu talla
              </h3>
              
              {availableSizes.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <a
                      key={size.id}
                      href={generateWhatsAppLink(
                        { name: product.name, slug: product.slug, final_price: product.final_price },
                        size.size,
                        whatsappNumber
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`py-3 px-4 text-center border rounded-lg font-medium transition-all ${
                        size.is_available
                          ? 'border-gray-300 hover:border-black hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                      }`}
                    >
                      {size.size}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay tallas disponibles</p>
              )}
            </div>

            <a
              href={generateWhatsAppLink(
                { name: product.name, slug: product.slug, final_price: product.final_price },
                'Consultar disponibilidad',
                whatsappNumber
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar por WhatsApp
            </a>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>100% Auténticos</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Envío a toda la República</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Atención personalizada por WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function getGenderLabel(gender: string): string {
  const labels: Record<string, string> = {
    men: 'Hombre',
    women: 'Mujer',
    unisex: 'Unisex',
    kids: 'Niño'
  }
  return labels[gender] || gender
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    running: 'Running',
    basketball: 'Basketball',
    casual: 'Casual',
    lifestyle: 'Lifestyle',
    limited_edition: 'Limited Edition'
  }
  return labels[category] || category
}

function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new_with_box: 'Nuevo con caja',
    new_without_box: 'Nuevo sin caja',
    preowned: 'Seminuevo'
  }
  return labels[condition] || condition
}
