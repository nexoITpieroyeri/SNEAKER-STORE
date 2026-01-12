import { createClient } from '@/lib/supabase/server'

export default async function AdminAnalyticsPage() {
  const supabase = createClient()

  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const { data: views } = await supabase
    .from('product_views')
    .select('*')
    .order('viewed_at', { ascending: false })
    .limit(100)

  const eventTypes = events?.reduce((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const thisWeekViews = views?.filter(v => new Date(v.viewed_at) > weekAgo).length || 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Últimos 90 días</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Vistas esta semana</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{thisWeekViews}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Eventos registrados</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{events?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Clics WhatsApp</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{eventTypes['whatsapp_click'] || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Total vistas</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{views?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Eventos</h2>
          <div className="space-y-3">
            {Object.entries(eventTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-gray-600">{type}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {views?.slice(0, 10).map((view) => (
              <div key={view.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{view.product_id.slice(0, 8)}...</span>
                <span className="text-gray-500">
                  {new Date(view.viewed_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
