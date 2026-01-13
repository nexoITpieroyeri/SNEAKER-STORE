import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingBag, Heart, Instagram, MessageCircle, User, Settings, Menu, X, LogOut } from 'lucide-react'
import { Button } from './ui/Button'
import { useCartStore } from '../store/favoritesStore'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { handleWhatsAppClick, clearWhatsAppCache } from '../lib/whatsapp'

export function Header() {
  const { favorites } = useCartStore()
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    clearWhatsAppCache()
    
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        try {
          const { data: admin } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single()
          setIsAdmin(!!admin)
        } catch {
          setIsAdmin(false)
        }
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('admin_users').select('id').eq('id', session.user.id).single()
          .then(({ data }) => setIsAdmin(!!data))
          .catch(() => setIsAdmin(false))
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleWhatsAppContact = async () => {
    await handleWhatsAppClick({
      type: 'general'
    })
  }

  const navLinks = [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/catalogo?gender=men', label: 'Hombre' },
    { to: '/catalogo?gender=women', label: 'Mujer' },
    { to: '/catalogo?category=limited_edition', label: 'Limited' },
    { to: '/mis-pedidos', label: 'Mis Pedidos' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SNEAKER STORE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = searchParams.get('gender') === 'men' && link.to === '/catalogo?gender=men' ||
                searchParams.get('gender') === 'women' && link.to === '/catalogo?gender=women' ||
                searchParams.get('category') === 'limited_edition' && link.to === '/catalogo?category=limited_edition' ||
                link.to === '/catalogo' && !searchParams.get('gender') && !searchParams.get('category')
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-1">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:block text-sm text-slate-500">
                  {user.email}
                </span>
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button variant="ghost" size="icon" className="text-slate-600" title="Panel Admin">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600">
                  <LogOut className="h-4 w-4 mr-1 md:mr-0" />
                  <span className="md:hidden ml-1">Salir</span>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600">
                    <User className="h-4 w-4 mr-1" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                    Registro
                  </Button>
                </Link>
              </div>
            )}

            <Link to="/favoritos" className="relative">
              <Button variant="ghost" size="icon" className="text-slate-600">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block"
            >
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-pink-600">
                <Instagram className="h-5 w-5" />
              </Button>
            </a>

            <button
              onClick={handleWhatsAppContact}
              className="hidden md:block"
            >
              <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </button>

            {!user && (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="md:hidden text-slate-600" title="Login">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = searchParams.get('gender') === 'men' && link.to === '/catalogo?gender=men' ||
                searchParams.get('gender') === 'women' && link.to === '/catalogo?gender=women' ||
                searchParams.get('category') === 'limited_edition' && link.to === '/catalogo?category=limited_edition' ||
                link.to === '/catalogo' && !searchParams.get('gender') && !searchParams.get('category')
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <hr className="my-2" />
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                >
                  Registro
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
