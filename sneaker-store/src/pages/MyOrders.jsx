import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Phone, Package, Check, Clock, Truck, Eye } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { supabase } from '../lib/supabase'

export function MyOrdersPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [searched, setSearched] = useState(false)
  const [savedPhone, setSavedPhone] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('customer_phone')
    if (saved) {
      setSavedPhone(saved)
      setPhone(saved)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!phone.trim()) {
      alert('Por favor ingresa tu número de teléfono')
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const cleanPhone = phone.replace(/\D/g, '')
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .ilike('customer_phone', `%${cleanPhone}%`)
        .order('created_at', { ascending: false })

      if (error) throw error

      setOrders(data || [])
      localStorage.setItem('customer_phone', cleanPhone)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setPhone('')
    setOrders([])
    setSearched(false)
    localStorage.removeItem('customer_phone')
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
      pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      confirmed: 'bg-green-100 text-green-700 border border-green-200',
      shipped: 'bg-blue-100 text-blue-700 border border-blue-200',
      delivered: 'bg-purple-100 text-purple-700 border border-purple-200',
      cancelled: 'bg-red-100 text-red-700 border border-red-200'
    }
    return colors[status] || 'bg-slate-100 text-slate-700'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <Check className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <Package className="h-4 w-4" />,
      cancelled: <Eye className="h-4 w-4" />
    }
    return icons[status] || <Package className="h-4 w-4" />
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    }
    return labels[status] || status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <Card className="bg-white border border-gray-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Mis Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Ingresa tu número de teléfono para ver tus pedidos
              </p>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600">Número de teléfono</label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="51987654321"
                        className="pl-10 bg-white border-gray-300 text-slate-900"
                      />
                    </div>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                      {loading ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Usa el número que proporcionaste al hacer tu pedido
                  </p>
                </div>
              </form>

              {savedPhone && !searched && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Teléfono guardado: <span className="font-medium text-slate-900">{savedPhone}</span>
                  </span>
                  <Button variant="ghost" size="sm" onClick={clearSearch} className="text-slate-600 hover:text-slate-900">
                    Cambiar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {searched && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : orders.length === 0 ? (
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No se encontraron pedidos</p>
                    <p className="text-sm text-slate-500 mt-2">
                      No tenemos registros de pedidos con este número de teléfono
                    </p>
                    <Link to="/catalogo">
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Ver Catálogo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={clearSearch} className="text-slate-600 hover:text-slate-900">
                      Buscar otro número
                    </Button>
                  </div>

                  {orders.map((order) => (
                    <Card key={order.id} className="bg-white border border-gray-200 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div>
                            <p className="font-medium text-slate-900">{order.product_name}</p>
                            <p className="text-sm text-slate-500">
                              {order.size && `Talla: ${order.size} • `}
                              Cantidad: {order.quantity || 1}
                            </p>
                          </div>
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="text-sm">
                            <p className="text-slate-500">Total:</p>
                            <p className="text-xl font-bold text-slate-900">{formatCurrency(order.total_amount)}</p>
                          </div>
                          <div className="text-right text-sm text-slate-500">
                            <p>Pedido el</p>
                            <p>{new Date(order.created_at).toLocaleDateString('es-PE')}</p>
                            <p>{new Date(order.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-slate-400">Notas:</p>
                            <p className="text-sm text-slate-600">{order.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {!searched && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Pendiente</p>
                    <p className="text-sm font-medium text-slate-700">Por confirmar</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Check className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Confirmado</p>
                    <p className="text-sm font-medium text-slate-700">Aceptado</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Truck className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Enviado</p>
                    <p className="text-sm font-medium text-slate-700">En camino</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Usa el mismo número de teléfono que usaste para hacer tu pedido por WhatsApp
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
