import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { supabase } from '../lib/supabase'

export function CatalogFilters({ brands, filters, setFilters }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Marca</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.slug)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFilters({ ...filters, brands: [...filters.brands, brand.slug] })
                  } else {
                    setFilters({ ...filters, brands: filters.brands.filter(b => b !== brand.slug) })
                  }
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Género</h3>
        <div className="space-y-2">
          {['men', 'women', 'unisex', 'kids'].map(gender => (
            <label key={gender} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === gender}
                onChange={() => setFilters({ ...filters, gender })}
                className="border-gray-300"
              />
              <span className="text-sm capitalize">{gender}</span>
            </label>
          ))}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              checked={filters.gender === ''}
              onChange={() => setFilters({ ...filters, gender: '' })}
              className="border-gray-300"
            />
            <span className="text-sm">Todos</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Precio</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={filters.priceRange === 'all'}
              onChange={() => setFilters({ ...filters, priceRange: 'all' })}
              className="border-gray-300"
            />
            <span className="text-sm">Todos los precios</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={filters.priceRange === '0-2000'}
              onChange={() => setFilters({ ...filters, priceRange: '0-2000' })}
              className="border-gray-300"
            />
            <span className="text-sm">Menos de $2,000</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={filters.priceRange === '2000-4000'}
              onChange={() => setFilters({ ...filters, priceRange: '2000-4000' })}
              className="border-gray-300"
            />
            <span className="text-sm">$2,000 - $4,000</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={filters.priceRange === '4000+'}
              onChange={() => setFilters({ ...filters, priceRange: '4000+' })}
              className="border-gray-300"
            />
            <span className="text-sm">Más de $4,000</span>
          </label>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setFilters({ search: '', brands: [], gender: '', priceRange: 'all' })}
      >
        Limpiar filtros
      </Button>
    </div>
  )
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    brands: searchParams.getAll('brand') || [],
    gender: searchParams.get('gender') || '',
    priceRange: 'all',
  })

  useEffect(() => {
    async function fetchBrands() {
      try {
        const { data } = await supabase
          .from('brands')
          .select('id, name, slug')
          .eq('is_active', true)
          .order('name')
        
        setBrands(data || [])
      } catch (err) {
        console.error('Error loading brands:', err)
        setBrands([])
      }
    }

    fetchBrands()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            brand:brands(name, slug),
            product_images(url, alt_text, sort_order, is_primary),
            product_sizes(size, stock_quantity)
          `)
          .eq('status', 'published')

        const { data, error } = await query

        if (error) throw error

        let filteredData = data || []

        if (filters.search) {
          filteredData = filteredData.filter(p => 
            p.name.toLowerCase().includes(filters.search.toLowerCase())
          )
        }

        if (filters.brands.length > 0) {
          filteredData = filteredData.filter(p => filters.brands.includes(p.brand?.slug))
        }

        if (filters.gender) {
          filteredData = filteredData.filter(p => p.gender === filters.gender)
        }

        if (filters.priceRange !== 'all') {
          filteredData = filteredData.filter(p => {
            const price = p.final_price || p.base_price
            if (filters.priceRange === '0-2000') return price < 2000
            if (filters.priceRange === '2000-4000') return price >= 2000 && price <= 4000
            if (filters.priceRange === '4000+') return price > 4000
            return true
          })
        }

        const formattedProducts = filteredData.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          base_price: p.base_price,
          final_price: p.final_price || p.base_price,
          discount_percentage: p.discount_percentage,
          brand: p.brand,
          images: p.product_images?.sort((a, b) => a.sort_order - b.sort_order).map(img => ({ 
            image_url: img.url 
          })) || [],
          has_stock: p.product_sizes?.some(s => s.stock_quantity > 0) || false
        }))

        setProducts(formattedProducts)
      } catch (err) {
        console.error('Error loading products:', err)
        setProducts([])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [filters])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Catálogo</h1>
          <Button
            variant="outline"
            className="md:hidden gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className={`hidden md:block w-64 flex-shrink-0 ${showFilters ? 'block' : ''}`}>
            <div className="sticky top-24">
              <CatalogFilters brands={brands} filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron productos con esos filtros.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
