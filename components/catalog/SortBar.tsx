'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface SortBarProps {
  currentSort: string
}

export function SortBar({ currentSort }: SortBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'popular', label: 'Más populares' },
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'name', label: 'Nombre A-Z' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm text-gray-600">Ordenar por:</label>
      <select
        name="sort"
        value={currentSort}
        onChange={handleChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
