import { createClient } from '@/lib/supabase/server'
import { ProductWithDetails, Brand } from '@/lib/supabase/types'
import Link from 'next/link'
import Image from 'next/image'

export default async function BrandsPage() {
  const supabase = createClient()

  const { data: brands, count: brandCount } = await supabase
    .from('brands')
    .select('*, products(count)', { count: 'exact' })
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marcas</h1>
          <p className="text-gray-600">
            {brandCount || 0} marcas disponibles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands?.map((brand) => (
            <Link
              key={brand.id}
              href={`/catalogo?brand=${brand.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-8 flex flex-col items-center group"
            >
              <div className="w-20 h-20 mb-4 flex items-center justify-center">
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    width={80}
                    height={80}
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">{brand.name[0]}</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{brand.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {(brand.products as unknown as { count: number }[])?.[0]?.count || 0} productos
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">¿No encuentras tu marca?</h2>
          <p className="text-gray-600 mb-6">Contáctanos y con gusto agregamos más marcas a nuestro catálogo</p>
          <Link
            href="/contacto"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  )
}
