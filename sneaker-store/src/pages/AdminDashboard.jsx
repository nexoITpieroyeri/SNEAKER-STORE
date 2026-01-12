import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Package, ShoppingBag, Users, BarChart3, Settings, Plus, 
  Edit, Trash2, LogOut, Home, Menu, X, TrendingUp, DollarSign,
  Eye, MessageCircle, Archive
} from 'lucide-react'

const navItems = [
  { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Productos' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Pedidos' },
  { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
  { path: '/admin/settings', icon: Settings, label: 'Configuración' },
]

export function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/admin/login')
        return
      }
      setUser(user)

      const { data: admin } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!admin) {
        await supabase.auth.signOut()
        navigate('/admin/login')
        return
      }

      setIsAdmin(true)
      setLoading(false)
    } catch (e) {
      navigate('/admin/login')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />
      case 'products':
        return <ProductsView />
      case 'orders':
        return <OrdersView />
      case 'analytics':
        return <AnalyticsView />
      case 'settings':
        return <SettingsView user={user} />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">Sneaker Admin</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setCurrentView(item.path.replace('/admin/', ''))
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.path.replace('/admin/', '')
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-medium">{user?.email?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2 border-slate-600 text-slate-300 hover:bg-slate-700" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 bg-slate-800/50 backdrop-blur border-b border-slate-700 flex items-center justify-between px-4">
          <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-slate-400 hover:text-white">
              Ver tienda
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

function DashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400">Resumen de tu tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Productos</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Ventas del mes</p>
                <p className="text-3xl font-bold">$12,450</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Visitas</p>
                <p className="text-3xl font-bold">1,234</p>
              </div>
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Eye className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Consultas WhatsApp</p>
                <p className="text-3xl font-bold">89</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Últimos Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Nike Dunk Low Panda', price: '$2,500', status: 'Publicado' },
                { name: 'Jordan 1 High Chicago', price: '$2,900', status: 'Publicado' },
                { name: 'Yeezy 350 Zebra', price: '$4,500', status: 'Agotado' },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-600"></div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-slate-400">{product.price}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.status === 'Publicado' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" /> Nuevo Producto
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
              <Archive className="h-4 w-4" /> Archivar Productos
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
              <Settings className="h-4 w-4" /> Configurar WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProductsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-slate-400">Gestiona tu catálogo</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-slate-400 text-sm">
                <th className="p-4">Producto</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Nike Dunk Low Panda', price: '$2,500', stock: 5, status: 'published' },
                { name: 'Jordan 1 High Chicago', price: '$2,900', stock: 2, status: 'published' },
                { name: 'Yeezy 350 Zebra', price: '$4,500', stock: 0, status: 'sold_out' },
                { name: 'NB 550 White Green', price: '$2,500', stock: 3, status: 'published' },
              ].map((product, i) => (
                <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-600"></div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{product.price}</td>
                  <td className="p-4">{product.stock} unidades</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.status === 'published' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                    }`}>
                      {product.status === 'published' ? 'Publicado' : 'Agotado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function OrdersView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-slate-400">Historial de ventas por WhatsApp</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Los pedidos se gestionan por WhatsApp</p>
          <p className="text-sm text-slate-500 mt-2">Usa el dashboard para hacer seguimiento</p>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-slate-400">Estadísticas de tu tienda</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Gráficos coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsView({ user }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-slate-400">Ajustes de la tienda</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Email de contacto</label>
            <input type="email" defaultValue={user?.email} className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          </div>
          <div>
            <label className="text-sm text-slate-400">WhatsApp</label>
            <input type="text" defaultValue="521234567890" className="w-full mt-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Guardar cambios</Button>
        </CardContent>
      </Card>
    </div>
  )
}
