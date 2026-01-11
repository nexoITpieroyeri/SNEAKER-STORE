import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { ProductWithDetails, Brand } from '@/lib/supabase/types'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const supabase = createClient()

  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
    `)
    .eq('status', 'published')
    .eq('featured', true)
    .limit(8)

  const { data: newArrivals } = await supabase
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

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  const { data: stats } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')

  return (
    <div className="min-h-screen">
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Zapatillas<br />Auténticas
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-lg">
            Descubre los modelos más exclusivos de Nike, Adidas, Jordan y más.
            Compra con atención personalizada por WhatsApp.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Ver Catálogo
            </Link>
            <Link
              href="#marcas"
              className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Ver Marcas
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-black">{stats?.count || 0}+</p>
              <p className="text-gray-600">Productos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-black">{brands?.length || 0}+</p>
              <p className="text-gray-600">Marcas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-black">100%</p>
              <p className="text-gray-600">Auténticos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-black">24/7</p>
              <p className="text-gray-600">Atención</p>
            </div>
          </div>
        </div>
      </section>

      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Productos Destacados
              </h2>
              <Link 
                href="/catalogo?featured=true"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product as unknown as ProductWithDetails} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                ¿Cómo comprar?
              </h2>
              <p className="text-gray-400 mb-8">
                Compra de forma fácil y segura. Contactanos directamente por WhatsApp
                para resolver todas tus dudas y realizar tu compra.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Elige tu modelo</p>
                    <p className="text-gray-400 text-sm">Explora nuestro catálogo y selecciona el modelo que te gusta</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Consulta por WhatsApp</p>
                    <p className="text-gray-400 text-sm">Escríbenos para confirmar disponibilidad y talla</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Coordinamos tu compra</p>
                    <p className="text-gray-400 text-sm">Acordamos método de pago y envío</p>
                  </div>
                </div>
              </div>
              <Link
                href="/catalogo"
                className="inline-block mt-8 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Catálogo
              </Link>
            </div>
            <div className="relative aspect-square bg-gray-800 rounded-2xl overflow-hidden">
              <Image
                src="/how-to-buy.jpg"
                alt="Cómo comprar"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {newArrivals && newArrivals.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Nuevos Ingresos
              </h2>
              <Link 
                href="/catalogo?sort=newest"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product as unknown as ProductWithDetails} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="marcas" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Nuestras Marcas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {brands && brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/catalogo?brand=${brand.slug}`}
                className="flex items-center justify-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    width={80}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-900">{brand.name}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-green-500 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Tienes dudas?
            </h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Contáctanos directamente por WhatsApp. Nuestro equipo te atenderá
              de forma personalizada para ayudarte a encontrar tu modelo ideal.
            </p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
