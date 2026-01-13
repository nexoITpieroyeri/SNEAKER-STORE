import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { 
  Package, ShoppingBag, BarChart3, Settings, Plus, 
  Edit, Trash2, LogOut, Home, Menu, X, TrendingUp, DollarSign,
  Eye, MessageCircle, UserPlus, Archive, Check
} from 'lucide-react'
import { ConfirmModal, useConfirm, useToast } from '../components/ConfirmModal'

const navItems = [
  { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Productos' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Pedidos' },
  { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
  { path: '/admin/settings', icon: Settings, label: 'Configuración' },
]

export function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const navigate = useNavigate()
  const { confirm, confirmState } = useConfirm()
  const { toast, ToastContainer } = useToast()

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
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
        navigate('/login')
        return
      }

      setLoading(false)
    } catch {
      navigate('/login')
    }
  }

  useEffect(() => {
    const init = async () => {
      await checkAdmin()
    }
    init()
  }, [])

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
        return <DashboardView setCurrentView={setCurrentView} />
      case 'products':
        return <ProductsView confirm={confirm} toast={toast} setCurrentView={setCurrentView} />
      case 'orders':
        return <OrdersView toast={toast} />
      case 'analytics':
        return <AnalyticsView />
      case 'settings':
        return <SettingsView user={user} toast={toast} confirm={confirm} />
      default:
        return <DashboardView setCurrentView={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ConfirmModal state={confirmState} />
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

      <ToastContainer />
    </div>
  )
}

function DashboardView({ setCurrentView }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    soldOutProducts: 0,
    salesThisMonth: 0,
    pendingOrders: 0,
    totalOrders: 0,
    visitsThisMonth: 0,
    whatsappQueriesThisMonth: 0
  })
  const [latestProducts, setLatestProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const today = new Date()
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()

      const [
        allProductsResult,
        publishedResult,
        soldOutResult,
        ordersResult,
        pendingOrdersResult,
        analyticsResult
      ] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'sold_out'),
        supabase
          .from('orders')
          .select('id, total_amount')
          .gte('created_at', firstDayOfMonth)
          .in('status', ['confirmed', 'shipped', 'delivered']),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase
          .from('analytics')
          .select('visits, whatsapp_queries')
          .gte('date', firstDayOfMonth)
      ])

      let salesTotal = 0
      if (ordersResult.data) {
        salesTotal = ordersResult.data.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)
      }

      let visits = 0
      let whatsappQueries = 0
      if (analyticsResult.data && analyticsResult.data.length > 0) {
        visits = analyticsResult.data.reduce((sum, a) => sum + (a.visits || 0), 0)
        whatsappQueries = analyticsResult.data.reduce((sum, a) => sum + (a.whatsapp_queries || 0), 0)
      } else {
        await seedSampleAnalytics()
        const { data: newAnalytics } = await supabase
          .from('analytics')
          .select('visits, whatsapp_queries')
          .gte('date', firstDayOfMonth)
        if (newAnalytics) {
          visits = newAnalytics.reduce((sum, a) => sum + (a.visits || 0), 0)
          whatsappQueries = newAnalytics.reduce((sum, a) => sum + (a.whatsapp_queries || 0), 0)
        }
      }

      setStats({
        totalProducts: allProductsResult.count || 0,
        publishedProducts: publishedResult.count || 0,
        soldOutProducts: soldOutResult.count || 0,
        salesThisMonth: salesTotal,
        pendingOrders: pendingOrdersResult.count || 0,
        totalOrders: ordersResult.data?.length || 0,
        visitsThisMonth: visits,
        whatsappQueriesThisMonth: whatsappQueries
      })

      const { data: products } = await supabase
        .from('products')
        .select(`
          id,
          name,
          base_price,
          final_price,
          discount_percentage,
          status,
          created_at,
          brand:brands(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setLatestProducts(products || [])
    } catch (err) {
      console.error('Error loading dashboard:', err)
      setStats({
        totalProducts: 0,
        publishedProducts: 0,
        soldOutProducts: 0,
        salesThisMonth: 0,
        pendingOrders: 0,
        totalOrders: 0,
        visitsThisMonth: 0,
        whatsappQueriesThisMonth: 0
      })
      setLatestProducts([])
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const seedSampleAnalytics = async () => {
    const today = new Date()
    const data = []
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const visits = Math.floor(Math.random() * 50) + 10
      const queries = Math.floor(Math.random() * 15) + 1
      
      data.push({
        date: dateStr,
        visits: visits,
        whatsapp_queries: queries
      })
    }
    
    try {
      const { error } = await supabase
        .from('analytics')
        .upsert(data, { onConflict: 'date' })
      
      if (error) console.error('Error seeding analytics:', error)
    } catch (err) {
      console.error('Error seeding analytics:', err)
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      published: 'Publicado',
      sold_out: 'Agotado',
      draft: 'Borrador',
      archived: 'Archivado',
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-600/20 text-green-400',
      sold_out: 'bg-red-600/20 text-red-400',
      draft: 'bg-yellow-600/20 text-yellow-400',
      archived: 'bg-slate-600/20 text-slate-400'
    }
    return colors[status] || 'bg-slate-600/20 text-slate-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400">Resumen de tu tienda</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadDashboardData} className="border-slate-600 text-slate-300">
          <Package className="h-4 w-4 mr-2" /> Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-16"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Productos</p>
                  <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  <p className="text-xs text-slate-500 mt-1">{stats.publishedProducts} publicados</p>
                </div>
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Package className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-28 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-20"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Ventas del Mes</p>
                  <p className="text-3xl font-bold">{formatCurrency(stats.salesThisMonth)}</p>
                  <p className="text-xs text-slate-500 mt-1">{stats.totalOrders} pedidos</p>
                </div>
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-16 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-16"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pedidos Pendientes</p>
                  <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                  <p className="text-xs text-slate-500 mt-1">por confirmar</p>
                </div>
                <div className="p-3 bg-yellow-600/20 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-28 mb-2"></div>
                <div className="h-8 bg-slate-700 rounded w-12"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Consultas WhatsApp</p>
                  <p className="text-3xl font-bold">{stats.whatsappQueriesThisMonth}</p>
                  <p className="text-xs text-slate-500 mt-1">este mes</p>
                </div>
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Últimos Productos
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')} className="text-slate-400 hover:text-white">
                Ver todos <Package className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-slate-600 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-600 rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-slate-600 rounded w-20 mt-2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {latestProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-600 flex items-center justify-center">
                        <Package className="h-5 w-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                        <p className="text-sm text-slate-400">
                          {product.brand?.name} • {formatCurrency(product.final_price || product.base_price)}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                  </div>
                ))}
                {latestProducts.length === 0 && (
                  <p className="text-center text-slate-400 py-4">No hay productos aún</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => setCurrentView('products')}
            >
              <Plus className="h-4 w-4" /> Nuevo Producto
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => setCurrentView('orders')}
            >
              <ShoppingBag className="h-4 w-4" /> Ver Pedidos
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => setCurrentView('analytics')}
            >
              <BarChart3 className="h-4 w-4" /> Ver Analytics
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => setCurrentView('settings')}
            >
              <Settings className="h-4 w-4" /> Configuración
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProductsView({ confirm, toast }) {
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(name),
          product_sizes(size, stock_quantity)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error loading products:', err)
      setProducts([
        { id: 1, name: 'Nike Dunk Low Panda', base_price: 2500, final_price: 2500, discount_percentage: 0, status: 'published', brand: { name: 'Nike' }, product_sizes: [{ size: 'US 8', stock_quantity: 5 }] },
        { id: 2, name: 'Jordan 1 High Chicago', base_price: 3200, final_price: 2900, discount_percentage: 10, status: 'published', brand: { name: 'Jordan' }, product_sizes: [{ size: 'US 9', stock_quantity: 2 }] },
        { id: 3, name: 'Yeezy 350 Zebra', base_price: 4500, final_price: 4500, discount_percentage: 0, status: 'sold_out', brand: { name: 'Yeezy' }, product_sizes: [] },
        { id: 4, name: 'NB 550 White Green', base_price: 2800, final_price: 2500, discount_percentage: 10, status: 'published', brand: { name: 'New Balance' }, product_sizes: [{ size: 'US 8', stock_quantity: 3 }] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = async (product) => {
    const confirmed = await confirm({
      title: 'Eliminar producto',
      message: `¿Estás seguro de eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      type: 'danger'
    })

    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      setProducts(products.filter(p => p.id !== product.id))
      toast({ title: 'Producto eliminado correctamente', type: 'success' })
    } catch {
      setProducts(products.filter(p => p.id !== product.id))
      toast({ title: 'Producto eliminado', type: 'success' })
    }
  }

  const handleChangeStatus = async (product, newStatus) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)

      if (error) throw error

      setProducts(products.map(p => 
        p.id === product.id ? { ...p, status: newStatus } : p
      ))

      toast({ title: 'Estado actualizado', type: 'success' })
    } catch {
      toast({ title: 'Error al actualizar estado', type: 'danger' })
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100)
  }

  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: productData.name,
            base_price: parseFloat(productData.base_price),
            discount_percentage: parseFloat(productData.discount_percentage) || 0,
            gender: productData.gender,
            category: productData.category,
            description: productData.description,
            sku: productData.sku || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)

        if (error) throw error

        toast({ title: 'Producto actualizado correctamente', type: 'success' })
      } else {
        if (!productData.brand_id) {
          toast({ title: 'Selecciona una marca', type: 'danger' })
          return
        }

        if (!productData.name || productData.name.trim() === '') {
          toast({ title: 'Ingresa un nombre para el producto', type: 'danger' })
          return
        }

        const slug = generateSlug(productData.name)

        const { data, error } = await supabase
          .from('products')
          .insert({
            name: productData.name.trim(),
            slug: slug + '-' + Date.now(),
            base_price: parseFloat(productData.base_price),
            discount_percentage: parseFloat(productData.discount_percentage) || 0,
            gender: productData.gender,
            category: productData.category,
            description: productData.description || null,
            sku: productData.sku || null,
            brand_id: productData.brand_id,
            status: 'draft'
          })
          .select()
          .single()

        if (error) {
          console.error('Supabase error:', error)
          throw new Error(error.message)
        }

        if (data && productData.sizes && productData.sizes.length > 0) {
          const sizesData = productData.sizes
            .filter(s => s.size && s.stock > 0)
            .map(s => ({
              product_id: data.id,
              size: s.size,
              stock_quantity: parseInt(s.stock)
            }))

          if (sizesData.length > 0) {
            const { error: sizesError } = await supabase
              .from('product_sizes')
              .insert(sizesData)
            
            if (sizesError) {
              console.error('Error inserting sizes:', sizesError)
            }
          }
        }

        toast({ title: 'Producto creado correctamente', type: 'success' })
      }

      loadProducts()
      setShowModal(false)
      setEditingProduct(null)
    } catch (err) {
      console.error('Error saving product:', err)
      toast({ title: 'Error: ' + (err.message || 'No se pudo guardar'), type: 'danger' })
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(price || 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-slate-400">{products.length} productos en total</p>
        </div>
        <Button 
          className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={() => {
            setEditingProduct(null)
            setShowModal(true)
          }}
        >
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Card className="bg-slate-800 border-slate-700 min-w-[700px]">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr className="text-left text-slate-400 text-sm">
                    <th className="p-4">Producto</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Tallas</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-600 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium truncate max-w-[200px] block">{product.name}</span>
                            <span className="text-xs text-slate-400">{product.brand?.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="font-medium">{formatPrice(product.final_price || product.base_price)}</span>
                          {product.discount_percentage > 0 && (
                            <span className="text-xs text-slate-400 line-through ml-2">
                              {formatPrice(product.base_price)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {product.product_sizes?.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-slate-700 rounded">
                              {s.size}
                            </span>
                          ))}
                          {product.product_sizes?.length > 3 && (
                            <span className="text-xs text-slate-400">+{product.product_sizes.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={product.status}
                          onChange={(e) => handleChangeStatus(product, e.target.value)}
                          className={`text-xs px-2 py-1 rounded border cursor-pointer ${
                            product.status === 'published' ? 'bg-green-600/20 text-green-400 border-green-600/30' : 
                            product.status === 'sold_out' ? 'bg-red-600/20 text-red-400 border-red-600/30' : 
                            'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'
                          }`}
                        >
                          <option value="draft" className="bg-slate-800">Borrador</option>
                          <option value="published" className="bg-slate-800">Publicado</option>
                          <option value="sold_out" className="bg-slate-800">Agotado</option>
                          <option value="archived" className="bg-slate-800">Archivado</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-white"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-red-400"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No hay productos aún. ¡Crea tu primer producto!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {showModal && (
        <ProductModal 
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }} 
          onSave={handleSave}
          editingProduct={editingProduct}
        />
      )}
    </div>
  )
}

function ProductModal({ onClose, onSave, editingProduct }) {
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    slug: editingProduct?.slug || '',
    description: editingProduct?.description || '',
    base_price: editingProduct?.base_price || '',
    discount_percentage: editingProduct?.discount_percentage || '',
    gender: editingProduct?.gender || 'unisex',
    category: editingProduct?.category || 'casual',
    condition: editingProduct?.condition || 'new_with_box',
    brand_id: editingProduct?.brand_id || '',
    sku: editingProduct?.sku || '',
    images: [],
    sizes: editingProduct?.product_sizes?.map(s => ({ size: s.size, stock: s.stock_quantity })) || []
  })

  useEffect(() => {
    async function loadBrands() {
      try {
        const { data } = await supabase
          .from('brands')
          .select('id, name')
          .eq('is_active', true)
          .order('name')
        
        setBrands(data || [])
      } catch (err) {
        console.error('Error loading brands:', err)
        setBrands([])
      }
    }
    loadBrands()
  }, [])

  const genders = ['men', 'women', 'unisex', 'kids']
  const categories = ['running', 'basketball', 'casual', 'lifestyle', 'limited_edition']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  const handleAddSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: '', stock: 1 }]
    })
  }

  const handleRemoveSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index)
    })
  }

  const updateSize = (index, field, value) => {
    const newSizes = [...formData.sizes]
    newSizes[index][field] = value
    setFormData({ ...formData, sizes: newSizes })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800">
          <h2 className="text-xl font-bold">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Nombre del producto *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nike Dunk Low Panda"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Precio (PEN) *</label>
              <Input
                type="number"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="2500"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Descuento (%)</label>
              <Input
                type="number"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                placeholder="0"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Marca *</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white"
                required
              >
                <option value="">Seleccionar marca</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400">SKU</label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="DD1391-100"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Género</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white"
              >
                {genders.map(g => (
                  <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del producto..."
                rows={3}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">URLs de imágenes (una por línea)</label>
              <textarea
                value={formData.images.join('\n')}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(Boolean) })}
                placeholder="https://imagen1.jpg"
                rows={3}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-400">Tallas y Stock</label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddSize} className="border-slate-600 text-slate-300">
                  + Agregar talla
                </Button>
              </div>
              <div className="space-y-2">
                {formData.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={size.size}
                      onChange={(e) => updateSize(index, 'size', e.target.value)}
                      placeholder="US 9"
                      className="flex-1 bg-slate-700 border-slate-600 text-white"
                    />
                    <Input
                      type="number"
                      value={size.stock}
                      onChange={(e) => updateSize(index, 'stock', e.target.value)}
                      placeholder="Stock"
                      min="0"
                      className="w-24 bg-slate-700 border-slate-600 text-white"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSize(index)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.sizes.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-2">No hay tallas agregadas</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear Producto')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OrdersView({ toast }) {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, totalAmount: 0 })

  useEffect(() => {
    loadOrders()
    loadProducts()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const ordersData = data || []
      setOrders(ordersData)
      setStats({
        total: ordersData.length,
        pending: ordersData.filter(o => o.status === 'pending').length,
        confirmed: ordersData.filter(o => o.status === 'confirmed').length,
        totalAmount: ordersData.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)
      })
    } catch (err) {
      console.error('Error loading orders:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('id, name, base_price, final_price, product_sizes(size)')
        .eq('status', 'published')
      
      setProducts(data || [])
    } catch (err) {
      console.error('Error loading products:', err)
      setProducts([])
    }
  }

  const handleCreateOrder = async (orderData) => {
    try {
      const orderToInsert = {
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        product_name: orderData.product_name,
        product_id: orderData.product_id || null,
        size: orderData.size || null,
        quantity: orderData.quantity || 1,
        total_amount: orderData.total_amount || 0,
        status: orderData.status || 'pending',
        notes: orderData.notes || null
      }

      const { error } = await supabase
        .from('orders')
        .insert(orderToInsert)

      if (error) throw error
      
      toast({ title: 'Pedido creado correctamente', type: 'success' })
      loadOrders()
      setShowModal(false)
    } catch (err) {
      console.error('Error creating order:', err)
      toast({ title: 'Error al crear pedido', description: err.message || 'Unknown error', type: 'danger' })
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) {
        console.error('Supabase error:', error)
        toast({ title: 'Error de permisos', description: error.message, type: 'danger' })
        return
      }
      
      toast({ title: 'Estado actualizado', description: `Pedido marcado como ${newStatus}`, type: 'success' })
      loadOrders()
    } catch (err) {
      console.error('Error updating status:', err)
      toast({ title: 'Error al actualizar estado', description: err.message, type: 'danger' })
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId)

      if (error) {
        console.error('Supabase error:', error)
        toast({ title: 'Error de permisos', description: error.message, type: 'danger' })
        return
      }
      
      toast({ title: 'Pedido eliminado', type: 'success' })
      setOrders(orders.filter(o => o.id !== orderId))
      loadOrders()
    } catch (err) {
      console.error('Error deleting order:', err)
      toast({ title: 'Error al eliminar', description: err.message, type: 'danger' })
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-600/20 text-yellow-400',
      confirmed: 'bg-green-600/20 text-green-400',
      shipped: 'bg-blue-600/20 text-blue-400',
      delivered: 'bg-purple-600/20 text-purple-400',
      cancelled: 'bg-red-600/20 text-red-400'
    }
    return colors[status] || 'bg-slate-600/20 text-slate-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-slate-400">Gestiona los pedidos de tus clientes</p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" /> Nuevo Pedido
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Total Pedidos</p>
            <p className="text-2xl font-bold">{loading ? '-' : stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-400">{loading ? '-' : stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Confirmados</p>
            <p className="text-2xl font-bold text-green-400">{loading ? '-' : stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm">Total Ventas</p>
            <p className="text-2xl font-bold">{loading ? '-' : formatCurrency(stats.totalAmount)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Todos los Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No hay pedidos aún</p>
              <p className="text-sm text-slate-500 mt-2">Crea tu primer pedido manualmente o espera uno por WhatsApp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr className="text-left text-slate-400 text-sm">
                    <th className="p-4">ID</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Talla</th>
                    <th className="p-4">Monto</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-4 text-slate-400 text-xs">#{order.id.slice(-6)}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-slate-400">{order.customer_phone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="truncate max-w-[150px]">{order.product_name}</p>
                      </td>
                      <td className="p-4 text-sm">{order.size || '-'}</td>
                      <td className="p-4 font-medium">{formatCurrency(order.total_amount)}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded border cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="pending" className="bg-slate-800">Pendiente</option>
                          <option value="confirmed" className="bg-slate-800">Confirmado</option>
                          <option value="shipped" className="bg-slate-800">Enviado</option>
                          <option value="delivered" className="bg-slate-800">Entregado</option>
                          <option value="cancelled" className="bg-slate-800">Cancelado</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(order.created_at).toLocaleDateString('es-PE')}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <OrderModal
          products={products}
          toast={toast}
          onClose={() => setShowModal(false)}
          onSave={handleCreateOrder}
        />
      )}
    </div>
  )
}

function OrderModal({ products, toast, onClose, onSave }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    product_id: '',
    product_name: '',
    size: '',
    quantity: 1,
    total_amount: 0,
    status: 'pending',
    notes: ''
  })

  const selectedProduct = products.find(p => p.id === formData.product_id)

  useEffect(() => {
    if (selectedProduct) {
      const price = selectedProduct.final_price || selectedProduct.base_price
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          product_name: selectedProduct.name,
          total_amount: price * prev.quantity
        }))
      }, 0)
    }
  }, [formData.product_id, selectedProduct])

  useEffect(() => {
    if (selectedProduct) {
      const price = selectedProduct.final_price || selectedProduct.base_price
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          total_amount: price * prev.quantity
        }))
      }, 0)
    }
  }, [formData.quantity, selectedProduct])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.customer_name || !formData.customer_phone || !formData.product_id) {
      toast({ title: 'Completa los campos', description: 'Por favor llena todos los campos obligatorios', type: 'warning' })
      return
    }

    setLoading(true)
    await onSave(formData)
    setLoading(false)
  }

  const sizes = selectedProduct?.product_sizes?.map(s => s.size) || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-slate-800 rounded-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">Nuevo Pedido</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Cliente *</label>
              <Input
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Nombre del cliente"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Teléfono *</label>
              <Input
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="51987654321"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Producto *</label>
              <select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white"
                required
              >
                <option value="">Seleccionar producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - S/{(product.final_price || product.base_price).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {sizes.length > 0 && (
              <div className="md:col-span-2">
                <label className="text-sm text-slate-400">Talla</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white"
                >
                  <option value="">Seleccionar talla</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm text-slate-400">Cantidad</label>
              <Input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="mt-1 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Total (PEN)</label>
              <Input
                type="number"
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
                className="mt-1 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Notas</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionales..."
                rows={2}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Pedido'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AnalyticsView() {
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)
  const [totals, setTotals] = useState({ visits: 0, whatsappQueries: 0, pageViews: 0 })

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30)

      if (error) throw error

      const analyticsData = data || []
      setAnalytics(analyticsData)
      setTotals({
        visits: analyticsData.reduce((sum, a) => sum + (a.visits || 0), 0),
        whatsappQueries: analyticsData.reduce((sum, a) => sum + (a.whatsapp_queries || 0), 0),
        pageViews: analyticsData.reduce((sum, a) => sum + (a.page_views || 0), 0)
      })
    } catch (err) {
      console.error('Error loading analytics:', err)
      setAnalytics([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-slate-400">Estadísticas de tu tienda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Eye className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Visitas</p>
                <p className="text-2xl font-bold">{loading ? '-' : totals.visits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Consultas WhatsApp</p>
                <p className="text-2xl font-bold">{loading ? '-' : totals.whatsappQueries.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Vistas de Página</p>
                <p className="text-2xl font-bold">{loading ? '-' : totals.pageViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Historial de Visitas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : analytics.length === 0 ? (
            <div className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No hay datos de analytics aún</p>
              <p className="text-sm text-slate-500 mt-2">Los datos de visitas aparecerán aquí</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700">
                  <tr className="text-left text-slate-400 text-sm">
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Visitas</th>
                    <th className="p-4">Consultas WhatsApp</th>
                    <th className="p-4">Vistas de Página</th>
                    <th className="p-4">Fuente</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((day) => (
                    <tr key={day.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="p-4">
                        {new Date(day.date).toLocaleDateString('es-PE', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4 font-medium">{day.visits || 0}</td>
                      <td className="p-4 text-green-400">{day.whatsapp_queries || 0}</td>
                      <td className="p-4">{day.page_views || 0}</td>
                      <td className="p-4">
                        <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300 capitalize">
                          {day.source || 'direct'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsView({ user, toast, confirm }) {
  const [admins, setAdmins] = useState([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminRole, setNewAdminRole] = useState('admin')
  const [loading, setLoading] = useState(false)
  
  const [settings, setSettings] = useState({
    whatsapp_number: '521234567890',
    site_name: 'Sneaker Store',
    contact_email: '',
    instagram_url: '',
    facebook_url: '',
    shipping_info: '',
    return_policy: '',
    about_text: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAdmins()
    loadSettings()
  }, [])

  const loadAdmins = async () => {
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })
    setAdmins(data || [])
  }

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .single()
      
      if (error) throw error
      
      if (data) {
        setSettings({
          whatsapp_number: data.whatsapp_number || '521234567890',
          site_name: data.site_name || 'Sneaker Store',
          contact_email: data.contact_email || '',
          instagram_url: data.instagram_url || '',
          facebook_url: data.facebook_url || '',
          shipping_info: data.shipping_info || '',
          return_policy: data.return_policy || '',
          about_text: data.about_text || ''
        })
      }
    } catch (err) {
      console.error('Error loading settings:', err)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'default',
          ...settings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (error) throw error
      
      toast({ title: 'Configuración guardada correctamente', type: 'success' })
    } catch (err) {
      toast({ title: 'Error al guardar: ' + err.message, type: 'danger' })
    } finally {
      setSaving(false)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: authUser, error: authError } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('email', newAdminEmail)
        .single()

      if (authError || !authUser) {
        toast({ title: 'El usuario debe registrarse primero', type: 'danger' })
        setLoading(false)
        return
      }

      const { error } = await supabase
        .from('admin_users')
        .insert({
          id: authUser.id,
          email: newAdminEmail,
          full_name: newAdminName,
          role: newAdminRole
        })

      if (error) throw error

      toast({ title: 'Administrador agregado correctamente', type: 'success' })
      setNewAdminEmail('')
      setNewAdminName('')
      loadAdmins()
    } catch (err) {
      toast({ title: err.message, type: 'danger' })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = async (admin) => {
    if (admin.id === user?.id) {
      toast({ title: 'No puedes eliminarte a ti mismo', type: 'danger' })
      return
    }

    const confirmed = await confirm({
      title: 'Eliminar administrador',
      message: `¿Estás seguro de eliminar a ${admin.full_name || admin.email}?`,
      type: 'danger'
    })

    if (!confirmed) return

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', admin.id)

    if (error) {
      toast({ title: error.message, type: 'danger' })
    } else {
      toast({ title: 'Administrador eliminado', type: 'success' })
      loadAdmins()
    }
  }

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
            <label className="text-sm text-slate-400">Nombre de la tienda</label>
            <Input 
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="mt-1 bg-slate-700 border-slate-600 text-white" 
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Email de contacto</label>
            <Input 
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="contacto@tienda.com"
              className="mt-1 bg-slate-700 border-slate-600 text-white" 
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Número de WhatsApp</label>
            <Input 
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="521234567890"
              className="mt-1 bg-slate-700 border-slate-600 text-white" 
            />
            <p className="text-xs text-slate-500 mt-1">Incluye código de país (51 para Perú)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Instagram URL</label>
              <Input 
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/tu-tienda"
                className="mt-1 bg-slate-700 border-slate-600 text-white" 
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Facebook URL</label>
              <Input 
                value={settings.facebook_url}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                placeholder="https://facebook.com/tu-tienda"
                className="mt-1 bg-slate-700 border-slate-600 text-white" 
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400">Sobre nosotros (Footer)</label>
            <textarea
              value={settings.about_text}
              onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
              placeholder="Somos tu tienda de confianza para zapatillas auténticas..."
              rows={3}
              className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white resize-none"
            />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Información de la Tienda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Política de envío</label>
            <textarea
              value={settings.shipping_info}
              onChange={(e) => setSettings({ ...settings, shipping_info: e.target.value })}
              placeholder="Ej: Envíos a todo el Perú. Lima: 1-2 días. Provincias: 3-5 días hábiles."
              rows={3}
              className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">Política de devoluciones</label>
            <textarea
              value={settings.return_policy}
              onChange={(e) => setSettings({ ...settings, return_policy: e.target.value })}
              placeholder="Ej: 30 días para devoluciones. El producto debe estar sin usar y con caja."
              rows={3}
              className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white resize-none"
            />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Gestionar Administradores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-400">Email del usuario</label>
              <Input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="usuario@email.com"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Nombre</label>
              <Input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                placeholder="Nombre del admin"
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Rol</label>
              <select
                value={newAdminRole}
                onChange={(e) => setNewAdminRole(e.target.value)}
                className="mt-1 w-full p-3 bg-slate-700 border-slate-600 rounded-lg text-white"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Agregando...' : 'Agregar Administrador'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-400 mb-3">Administradores actuales</h4>
            <div className="space-y-2">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium">{admin.email?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium">{admin.full_name || 'Sin nombre'}</p>
                      <p className="text-xs text-slate-400">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      admin.role === 'super_admin' 
                        ? 'bg-purple-600/20 text-purple-400' 
                        : 'bg-blue-600/20 text-blue-400'
                    }`}>
                      {admin.role === 'super_admin' ? 'Super Admin' : admin.role === 'admin' ? 'Admin' : 'Editor'}
                    </span>
                    {admin.id !== user?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleRemoveAdmin(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

