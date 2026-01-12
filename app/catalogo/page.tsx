import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { ProductWithDetails, Brand } from '@/lib/supabase/types'
import { FilterSidebar } from '@/components/catalog/FilterSidebar'
import { SortBar } from '@/components/catalog/SortBar'
import Link from 'next/link'

interface CatalogPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    brand?: string
    gender?: string
    category?: string
    featured?: string
    min_price?: string
    max_price?: string
    sort?: string
  }>
}

const ITEMS_PER_PAGE = 12

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const supabase = createClient()
  const params = await searchParams

  const page = parseInt(params.page || '1')
  const search = params.search || ''
  const brandFilter = params.brand || ''
  const genderFilter = params.gender || ''
  const categoryFilter = params.category || ''
  const featuredFilter = params.featured === 'true'
  const minPrice = parseFloat(params.min_price || '0')
  const maxPrice = parseFloat(params.max_price || '100000')
  const sort = params.sort || 'newest'

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(id, name, slug),
      images:product_images(id, image_url, display_order),
      sizes:product_sizes(id, size, stock_quantity, is_available)
    `)
    .eq('status', 'published')
    .gte('final_price', minPrice)
    .lte('final_price', maxPrice)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  if (brandFilter) {
    query = query.eq('brand.slug', brandFilter)
  }

  if (genderFilter) {
    query = query.eq('gender', genderFilter)
  }

  if (categoryFilter) {
    query = query.eq('category', categoryFilter)
  }

  if (featuredFilter) {
    query = query.eq('featured', true)
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('final_price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('final_price', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    case 'popular':
      query = query.order('view_count', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1
  query = query.range(from, to)

  const { data: products, error } = await query

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Zapatillas</h1>
        <p className="text-gray-600 mb-8">
          {count || 0} productos disponibles
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar 
              brands={brands || []}
              currentFilters={{
                search,
                brand: brandFilter,
                gender: genderFilter,
                category: categoryFilter,
                minPrice,
                maxPrice,
                sort
              }}
            />
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <SortBar currentSort={sort} />
            </div>

            {products && products.length > 0 ? (
              <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={product as unknown as ProductWithDetails} 
                />
              ))}
            </div>

                {totalPages > 1 && (
                  <nav className="flex justify-center items-center gap-2 mt-8">
                    {page > 1 && (
                      <Link
                        href={`/catalogo?page=${page - 1}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Anterior
                      </Link>
                    )}
                    <span className="px-4 py-2 text-gray-600">
                      Página {page} de {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link
                        href={`/catalogo?page=${page + 1}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Siguiente
                      </Link>
                    )}
                  </nav>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No se encontraron productos con esos filtros</p>
                <Link href="/catalogo" className="text-black font-medium hover:underline mt-2 block">
                  Ver todos los productos
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
