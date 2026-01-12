'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Brand } from '@/lib/supabase/types'

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

export function FilterSidebar({ brands, currentFilters }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(e.target.name, e.target.value)
    router.push(`/catalogo?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/catalogo')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            name="search"
            defaultValue={currentFilters.search}
            placeholder="Buscar..."
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer"
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
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer"
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
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer"
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
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              name="max_price"
              defaultValue={currentFilters.maxPrice === 100000 ? '' : currentFilters.maxPrice}
              placeholder="Máx"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}
