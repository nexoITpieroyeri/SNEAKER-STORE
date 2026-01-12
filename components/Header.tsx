'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ShoppingBag, Menu, X, Heart, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navigateTo = (url: string) => {
    router.push(url)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => navigateTo('/')} className="text-2xl font-bold tracking-tight">
            SNEAKER<span className="text-gray-400">STORE</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('/catalogo')} className="text-gray-700 hover:text-black transition-colors">
              Catálogo
            </button>
            <button onClick={() => navigateTo('/catalogo?sort=newest')} className="text-gray-700 hover:text-black transition-colors">
              Nuevos
            </button>
            <button onClick={() => navigateTo('/catalogo?featured=true')} className="text-gray-700 hover:text-black transition-colors">
              Destacados
            </button>
            <button onClick={() => navigateTo('/#marcas')} className="text-gray-700 hover:text-black transition-colors">
              Marcas
            </button>
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

            <button onClick={() => navigateTo('/favoritos')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-5 h-5 text-gray-700" />
            </button>

            {!loading && (
              user ? (
                <div className="relative group">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="hidden lg:inline text-sm text-gray-700">
                      {user.email?.split('@')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="py-2">
                      <button onClick={() => navigateTo('/admin')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Panel Admin
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => navigateTo('/login')} className="text-sm text-gray-700 hover:text-black transition-colors">
                    Iniciar Sesión
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => navigateTo('/registro')} className="text-sm text-gray-700 hover:text-black transition-colors">
                    Registrarse
                  </button>
                </div>
              )
            )}

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
              <button onClick={() => { navigateTo('/catalogo'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-black">
                Catálogo
              </button>
              <button onClick={() => { navigateTo('/catalogo?sort=newest'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-black">
                Nuevos
              </button>
              <button onClick={() => { navigateTo('/catalogo?featured=true'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-black">
                Destacados
              </button>
              <button onClick={() => { navigateTo('/#marcas'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-black">
                Marcas
              </button>
              {!loading && !user && (
                <>
                  <hr className="my-2" />
                  <button onClick={() => { navigateTo('/login'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-black">
                    Iniciar Sesión
                  </button>
                  <button onClick={() => { navigateTo('/registro'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-gray-700 hover:text-black">
                    Registrarse
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
