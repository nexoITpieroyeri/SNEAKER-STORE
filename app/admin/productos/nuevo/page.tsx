import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { Brand } from '@/lib/supabase/types'

export default async function NewProductPage() {
  const supabase = createClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="text-gray-500 mt-1">Completa la información del producto</p>
      </div>

      <ProductForm brands={brands || []} />
    </div>
  )
}
