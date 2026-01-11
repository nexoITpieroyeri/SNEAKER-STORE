import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'
import { ProductWithDetails, Brand } from '@/lib/supabase/types'

interface CatalogPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    brand?: string
    gender?: string
    category?: string
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
  const minPrice = parseFloat(params.min_price || '0')
  const maxPrice = parseFloat(params.max_price || '100000')
  const sort = params.sort || 'newest'

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
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

  if (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Error al cargar productos</h1>
            <p className="text-gray-600 mt-2">Por favor intenta de nuevo más tarde</p>
          </div>
        </div>
      </div>
    )
  }

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
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product as unknown as ProductWithDetails} 
                    />
                  ))}
                </div>

                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages}
                  currentFilters={params}
                />
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No se encontraron productos con esos filtros</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

interface FilterSidebarProps {
  brands: Brand[]
  currentFilters: {
    search: string
    brand: string
    gender: string
    category: string
    minPrice: number
    maxPrice: number
    sort: string
  }
}

function FilterSidebar({ brands, currentFilters }: FilterSidebarProps) {
  const categories = [
    { value: 'running', label: 'Running' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'casual', label: 'Casual' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'limited_edition', label: 'Limited Edition' },
  ]

  const genders = [
    { value: 'men', label: 'Hombre' },
    { value: 'women', label: 'Mujer' },
    { value: 'unisex', label: 'Unisex' },
    { value: 'kids', label: 'Niño' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <form method="GET" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            name="search"
            defaultValue={currentFilters.search}
            placeholder="Buscar zapatillas..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <select
            name="brand"
            defaultValue={currentFilters.brand}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Todas las marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Género
          </label>
          <select
            name="gender"
            defaultValue={currentFilters.gender}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Todos</option>
            {genders.map((gender) => (
              <option key={gender.value} value={gender.value}>
                {gender.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            name="category"
            defaultValue={currentFilters.category}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="min_price"
              defaultValue={currentFilters.minPrice || ''}
              placeholder="Mín"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="max_price"
              defaultValue={currentFilters.maxPrice === 100000 ? '' : currentFilters.maxPrice}
              placeholder="Máx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Aplicar filtros
        </button>

        <a
          href="/catalogo"
          className="block text-center text-sm text-gray-600 hover:text-black"
        >
          Limpiar filtros
        </a>
      </form>
    </div>
  )
}

interface SortBarProps {
  currentSort: string
}

function SortBar({ currentSort }: SortBarProps) {
  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'popular', label: 'Más populares' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'name', label: 'Nombre A-Z' },
  ]

  return (
    <form method="GET" className="flex items-center gap-4">
      <label className="text-sm text-gray-600">Ordenar por:</label>
      <select
        name="sort"
        defaultValue={currentSort}
        onChange={(e) => e.target.form?.submit()}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  currentFilters: Record<string, string | undefined>
}

function Pagination({ currentPage, totalPages, currentFilters }: PaginationProps) {
  if (totalPages <= 1) return null

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    })
    params.set('page', page.toString())
    return `/catalogo?${params.toString()}`
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <a
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Anterior
        </a>
      )}

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum: number
        if (totalPages <= 5) {
          pageNum = i + 1
        } else if (currentPage <= 3) {
          pageNum = i + 1
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i
        } else {
          pageNum = currentPage - 2 + i
        }

        return (
          <a
            key={pageNum}
            href={createPageUrl(pageNum)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              currentPage === pageNum
                ? 'bg-black text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {pageNum}
          </a>
        )
      })}

      {currentPage < totalPages && (
        <a
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Siguiente
        </a>
      )}
    </nav>
  )
}
