import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils/helpers'
import { ProductWithDetails } from '@/lib/supabase/types'

interface AdminProductsPageProps {
  searchParams: Promise<{
    page?: string
    status?: string
    search?: string
  }>
}

const ITEMS_PER_PAGE = 20

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const supabase = createClient()
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const statusFilter = params.status || ''
  const search = params.search || ''

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(id, name),
      images:product_images(*),
      sizes:product_sizes(*)
    `, { count: 'exact' })

  if (statusFilter) {
    query = query.eq('status', statusFilter)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  query = query.order('created_at', { ascending: false })
  query = query.range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

  const { data: products, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <form className="flex gap-4">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Buscar productos..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <select
              name="status"
              defaultValue={statusFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="sold_out">Agotado</option>
              <option value="archived">Archivado</option>
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Filtrar
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Marca</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products?.map((product) => {
                const p = product as unknown as ProductWithDetails
                const totalStock = p.sizes?.reduce((sum, s) => sum + (s.stock_quantity || 0), 0) || 0
                const mainImage = p.images?.find(img => img.display_order === 1)?.image_url

                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {mainImage && (
                          <img src={mainImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-sm text-gray-500">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(p.brand as { name: string })?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          ${p.final_price.toLocaleString('es-MX')}
                        </p>
                        {p.discount_percentage && (
                          <p className="text-xs text-red-500">
                            -{p.discount_percentage}%
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        totalStock === 0 ? 'text-red-600' : totalStock < 3 ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {totalStock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatRelativeTime(p.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/productos/${p.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </Link>
                        <Link
                          href={`/producto/${p.slug}`}
                          target="_blank"
                          className="text-sm text-gray-600 hover:text-black"
                        >
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {(!products || products.length === 0) && (
          <div className="p-8 text-center text-gray-500">
            No se encontraron productos
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {((page - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(page * ITEMS_PER_PAGE, count || 0)} de {count || 0}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/productos?page=${page - 1}&status=${statusFilter}&search=${search}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/productos?page=${page + 1}&status=${statusFilter}&search=${search}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Siguiente
                </Link>
              )}
            </div>
          </div>
        )}
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
