import { createClient } from '@/lib/supabase/server'
import { getAnalytics } from '@/lib/actions/analyticsActions'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils/helpers'

export default async function AdminDashboard() {
  const analytics = await getAnalytics()
  const supabase = createClient()

  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, name, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: lowStockProducts } = await supabase
    .from('product_sizes')
    .select(`
      product_id,
      product:products(id, name),
      stock_quantity
    `)
    .lte('stock_quantity', 2)
    .limit(5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={analytics.totalProducts.toString()}
          icon="products"
          color="blue"
        />
        <StatCard
          title="Vistas Totales"
          value={analytics.totalViews.toString()}
          icon="views"
          color="green"
        />
        <StatCard
          title="Clics WhatsApp"
          value={analytics.totalWhatsAppClicks.toString()}
          icon="whatsapp"
          color="green"
        />
        <StatCard
          title="Esta Semana"
          value={analytics.viewsByDay.reduce((sum, d) => sum + d.count, 0).toString()}
          icon="calendar"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Productos Más Vistos
          </h2>
          <div className="space-y-4">
            {analytics.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400 w-6">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.view_count} vistas • {product.whatsapp_clicks} clicks
                  </p>
                </div>
                <Link
                  href={`/admin/productos/${product.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Productos Recientes
          </h2>
          <div className="space-y-4">
            {recentProducts?.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatRelativeTime(product.created_at)}
                  </p>
                </div>
                <StatusBadge status={product.status} />
              </div>
            ))}
          </div>
        </div>

        {lowStockProducts && lowStockProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ⚠️ Productos con Stock Bajo
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase">
                    <th className="pb-2">Producto</th>
                    <th className="pb-2">Stock</th>
                    <th className="pb-2">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lowStockProducts.map (
                    <tr key={item.product_id}>
                      ((item) =><td className="py-2 text-sm">
                        {(item.product as { name: string })?.name}
                      </td>
                      <td className="py-2">
                        <span className={`text-sm font-medium ${
                          item.stock_quantity === 0 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {item.stock_quantity} unidades
                        </span>
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/admin/productos/${item.product_id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Editar →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string
  value: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'red'
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon name={icon} />
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    sold_out: 'bg-red-100 text-red-700',
    archived: 'bg-yellow-100 text-yellow-700',
  }

  const labels: Record<string, string> = {
    published: 'Publicado',
    draft: 'Borrador',
    sold_out: 'Agotado',
    archived: 'Archivado',
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  )
}

function Icon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    products: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    views: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    whatsapp: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    calendar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  }
  return icons[name] || null
}
