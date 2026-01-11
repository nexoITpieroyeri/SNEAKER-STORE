'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            SNEAKER<span className="text-gray-400">STORE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/catalogo" className="text-gray-700 hover:text-black transition-colors">
              Catálogo
            </Link>
            <Link href="/catalogo?category=new_arrivals" className="text-gray-700 hover:text-black transition-colors">
              Nuevos
            </Link>
            <Link href="/catalogo?featured=true" className="text-gray-700 hover:text-black transition-colors">
              Destacados
            </Link>
            <Link href="/#marcas" className="text-gray-700 hover:text-black transition-colors">
              Marcas
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            <Link 
              href="/favoritos"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>
            <nav className="space-y-2">
              <Link 
                href="/catalogo" 
                className="block py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link 
                href="/catalogo?category=new_arrivals" 
                className="block py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Nuevos
              </Link>
              <Link 
                href="/catalogo?featured=true" 
                className="block py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Destacados
              </Link>
              <Link 
                href="/#marcas" 
                className="block py-2 text-gray-700 hover:text-black"
                onClick={() => setIsMenuOpen(false)}
              >
                Marcas
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
