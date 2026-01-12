import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { supabase } from '../lib/supabase'

const mockBrands = [
  { id: 1, name: 'Nike', slug: 'nike' },
  { id: 2, name: 'Adidas', slug: 'adidas' },
  { id: 3, name: 'Jordan', slug: 'jordan' },
  { id: 4, name: 'Yeezy', slug: 'yeezy' },
  { id: 5, name: 'New Balance', slug: 'new_balance' },
  { id: 6, name: 'Puma', slug: 'puma' },
]

const mockProducts = [
  {
    id: 1,
    name: 'Nike Dunk Low "Panda"',
    slug: 'nike-dunk-low-panda',
    base_price: 2500,
    final_price: 2500,
    discount_percentage: 0,
    brand: { name: 'Nike', slug: 'nike' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500' }],
    sizes: [{ size: 'US 8' }, { size: 'US 9' }, { size: 'US 10' }],
  },
  {
    id: 2,
    name: 'Air Jordan 1 High OG "Chicago"',
    slug: 'air-jordan-1-high-og-chicago',
    base_price: 3200,
    final_price: 2900,
    discount_percentage: 10,
    brand: { name: 'Jordan', slug: 'jordan' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' }],
    sizes: [{ size: 'US 8.5' }, { size: 'US 9' }],
  },
  {
    id: 3,
    name: 'Adidas Yeezy Boost 350 "Zebra"',
    slug: 'adidas-yeezy-boost-350-zebra',
    base_price: 4500,
    final_price: 4500,
    discount_percentage: 0,
    brand: { name: 'Yeezy', slug: 'yeezy' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500' }],
    sizes: [{ size: 'US 10' }, { size: 'US 11' }, { size: 'US 12' }],
  },
  {
    id: 4,
    name: 'New Balance 550 "White Green"',
    slug: 'new-balance-550-white-green',
    base_price: 2800,
    final_price: 2500,
    discount_percentage: 10,
    brand: { name: 'New Balance', slug: 'new_balance' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500' }],
    sizes: [{ size: 'US 7' }, { size: 'US 8' }, { size: 'US 9' }],
  },
]

export function CatalogFilters({ filters, setFilters }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Marca</h3>
        <div className="space-y-2">
          {mockBrands.map(brand => (
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
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    brands: searchParams.getAll('brand') || [],
    gender: searchParams.get('gender') || '',
    priceRange: 'all',
  })

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      let data = [...mockProducts]

      if (filters.search) {
        data = data.filter(p => 
          p.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      }

      if (filters.brands.length > 0) {
        data = data.filter(p => filters.brands.includes(p.brand.slug))
      }

      if (filters.gender) {
        data = data.filter(p => p.gender === filters.gender)
      }

      if (filters.priceRange !== 'all') {
        data = data.filter(p => {
          const price = p.final_price
          if (filters.priceRange === '0-2000') return price < 2000
          if (filters.priceRange === '2000-4000') return price >= 2000 && price <= 4000
          if (filters.priceRange === '4000+') return price > 4000
          return true
        })
      }

      setProducts(data)
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
              <CatalogFilters filters={filters} setFilters={setFilters} />
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
