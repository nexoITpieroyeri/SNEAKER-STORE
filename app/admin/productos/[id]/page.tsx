import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', id)
    .order('display_order')

  const { data: sizes } = await supabase
    .from('product_sizes')
    .select('*')
    .eq('product_id', id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
        <p className="text-gray-500 mt-1">{product.name}</p>
      </div>

      <ProductForm
        brands={brands || []}
        initialData={{
          id: product.id,
          name: product.name,
          brand_id: product.brand_id,
          description: product.description || '',
          base_price: product.base_price,
          discount_percentage: product.discount_percentage || 0,
          gender: product.gender,
          category: product.category,
          condition: product.condition,
          status: product.status,
          featured: product.featured,
          sku: product.sku || '',
          images: images?.map((img) => ({
            url: img.image_url,
            order: img.display_order,
          })) || [],
          sizes: sizes?.map((s) => ({
            size: s.size,
            stock: s.stock_quantity,
          })) || [],
        }}
      />
    </div>
  )
}
