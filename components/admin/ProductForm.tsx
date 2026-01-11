'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Brand } from '@/lib/supabase/types'

interface ProductFormProps {
  brands: Brand[]
  initialData?: {
    id?: string
    name: string
    brand_id: string
    description: string
    base_price: number
    discount_percentage: number
    gender: string
    category: string
    condition: string
    status: string
    featured: boolean
    sku: string
    images: { url: string; order: number }[]
    sizes: { size: string; stock: number }[]
  }
}

export function ProductForm({ brands, initialData }: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    brand_id: initialData?.brand_id || '',
    description: initialData?.description || '',
    base_price: initialData?.base_price || 0,
    discount_percentage: initialData?.discount_percentage || 0,
    gender: initialData?.gender || 'unisex',
    category: initialData?.category || 'casual',
    condition: initialData?.condition || 'new_with_box',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false,
    sku: initialData?.sku || '',
  })

  const [images, setImages] = useState<{ url: string; order: number }[]>(
    initialData?.images || [{ url: '', order: 1 }]
  )

  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>(
    initialData?.sizes || [{ size: '', stock: 0 }]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const finalPrice = formData.base_price * (1 - formData.discount_percentage / 100)

      const productData = {
        brand_id: formData.brand_id,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: formData.description,
        base_price: formData.base_price,
        discount_percentage: formData.discount_percentage,
        final_price: Math.round(finalPrice * 100) / 100,
        gender: formData.gender,
        category: formData.category,
        condition: formData.condition,
        status: formData.status,
        featured: formData.featured,
        sku: formData.sku,
      }

      let productId = initialData?.id

      if (initialData?.id) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialData.id)

        if (updateError) throw updateError

        await supabase.from('product_images').delete().eq('product_id', initialData.id)
        await supabase.from('product_sizes').delete().eq('product_id', initialData.id)
      } else {
        const { data, error: insertError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()

        if (insertError) throw insertError
        productId = data.id
      }

      const imageInserts = images
        .filter(img => img.url)
        .map((img, index) => ({
          product_id: productId!,
          image_url: img.url,
          display_order: img.order || index + 1,
        }))

      if (imageInserts.length > 0) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts)

        if (imagesError) throw imagesError
      }

      const sizeInserts = sizes
        .filter(s => s.size)
        .map(size => ({
          product_id: productId!,
          size: size.size,
          stock_quantity: size.stock,
          is_available: size.stock > 0,
        }))

      if (sizeInserts.length > 0) {
        const { error: sizesError } = await supabase
          .from('product_sizes')
          .insert(sizeInserts)

        if (sizesError) throw sizesError
      }

      router.push('/admin/productos')
      router.refresh()
    } catch (err) {
      console.error('Error saving product:', err)
      setError('Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    setImages([...images, { url: '', order: images.length + 1 }])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addSize = () => {
    setSizes([...sizes, { size: '', stock: 0 }])
  }

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold">Información General</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <select
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Seleccionar marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold">Clasificación</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Género *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="men">Hombre</option>
              <option value="women">Mujer</option>
              <option value="unisex">Unisex</option>
              <option value="kids">Niño</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="running">Running</option>
              <option value="basketball">Basketball</option>
              <option value="casual">Casual</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="limited_edition">Limited Edition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condición *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="new_with_box">Nuevo con caja</option>
              <option value="new_without_box">Nuevo sin caja</option>
              <option value="preowned">Seminuevo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold">Precios</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Base (MXN) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.base_price}
              onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descuento (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.discount_percentage}
              onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Final
            </label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-bold">
              ${(formData.base_price * (1 - formData.discount_percentage / 100)).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Imágenes</h2>
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Agregar imagen
          </button>
        </div>

        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="url"
                value={image.url}
                onChange={(e) => {
                  const newImages = [...images]
                  newImages[index].url = e.target.value
                  setImages(newImages)
                }}
                placeholder="URL de la imagen"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tallas y Stock</h2>
          <button
            type="button"
            onClick={addSize}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Agregar talla
          </button>
        </div>

        <div className="space-y-4">
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="text"
                value={size.size}
                onChange={(e) => {
                  const newSizes = [...sizes]
                  newSizes[index].size = e.target.value
                  setSizes(newSizes)
                }}
                placeholder="Talla (ej: US 9)"
                className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
              <input
                type="number"
                min="0"
                value={size.stock}
                onChange={(e) => {
                  const newSizes = [...sizes]
                  newSizes[index].stock = parseInt(e.target.value) || 0
                  setSizes(newSizes)
                }}
                placeholder="Stock"
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold">Estado</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="sold_out">Agotado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm font-medium text-gray-700">
                Producto destacado
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </button>
      </div>
    </form>
  )
}
