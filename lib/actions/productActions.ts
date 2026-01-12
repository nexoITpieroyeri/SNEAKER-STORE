'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255),
  brand_id: z.string().uuid('Marca inválida'),
  description: z.string().optional(),
  base_price: z.number().min(0, 'El precio debe ser mayor a 0'),
  discount_percentage: z.number().min(0).max(100).optional(),
  gender: z.enum(['men', 'women', 'unisex', 'kids']),
  category: z.enum(['running', 'basketball', 'casual', 'lifestyle', 'limited_edition']),
  condition: z.enum(['new_with_box', 'new_without_box', 'preowned']),
  status: z.enum(['draft', 'published', 'sold_out', 'archived']).default('published'),
  featured: z.boolean().default(false),
  sku: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url('URL de imagen inválida'),
    order: z.number()
  })).min(1, 'Al menos una imagen es requerida'),
  sizes: z.array(z.object({
    size: z.string().min(1, 'La talla es requerida'),
    stock: z.number().min(0, 'El stock no puede ser negativo')
  })).min(1, 'Al menos una talla es requerida')
})

type CreateProductInput = z.infer<typeof productSchema>

interface ActionResult {
  success: boolean
  data?: {
    id: string
    slug: string
  }
  error?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createProduct(input: CreateProductInput): Promise<ActionResult> {
  try {
    const supabase = createClient()
    
    const validatedData = productSchema.parse(input)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!adminUser || !['super_admin', 'admin', 'editor'].includes(adminUser.role)) {
      return { success: false, error: 'Sin permisos de administrador' }
    }

    const slug = generateSlug(validatedData.name)
    const finalPrice = validatedData.discount_percentage
      ? validatedData.base_price * (1 - validatedData.discount_percentage / 100)
      : validatedData.base_price

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        brand_id: validatedData.brand_id,
        name: validatedData.name,
        slug: slug,
        description: validatedData.description,
        base_price: validatedData.base_price,
        discount_percentage: validatedData.discount_percentage,
        final_price: Math.round(finalPrice * 100) / 100,
        gender: validatedData.gender,
        category: validatedData.category,
        condition: validatedData.condition,
        status: validatedData.status,
        featured: validatedData.featured,
        sku: validatedData.sku,
        view_count: 0,
        whatsapp_clicks: 0
      })
      .select()
      .single()

    if (productError || !product) {
      console.error('Error creating product:', productError)
      return { success: false, error: 'Error al crear el producto' }
    }

    const imageInserts = validatedData.images.map((img, index) => ({
      product_id: (product as any).id,
      image_url: img.url,
      display_order: img.order || index + 1
    }))

    const { error: imagesError } = await supabase
      .from('product_images')
      .insert(imageInserts)

    if (imagesError) {
      await supabase.from('products').delete().eq('id', (product as any).id)
      console.error('Error inserting images:', imagesError)
      return { success: false, error: 'Error al insertar imágenes' }
    }

    const sizeInserts = validatedData.sizes.map(size => ({
      product_id: (product as any).id,
      size: size.size,
      stock_quantity: size.stock,
      is_available: size.stock > 0
    }))

    const { error: sizesError } = await supabase
      .from('product_sizes')
      .insert(sizeInserts)

    if (sizesError) {
      await supabase.from('product_images').delete().eq('product_id', (product as any).id)
      await supabase.from('products').delete().eq('id', (product as any).id)
      console.error('Error inserting sizes:', sizesError)
      return { success: false, error: 'Error al insertar tallas' }
    }

    revalidatePath('/catalogo')
    revalidatePath('/')

    return {
      success: true,
      data: {
        id: (product as any).id,
        slug: (product as any).slug
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => e.message).join(', ')
      }
    }
    
    console.error('Unexpected error creating product:', error)
    return { success: false, error: 'Error inesperado al crear el producto' }
  }
}

interface UpdateProductInput extends CreateProductInput {
  id: string
}

export async function updateProduct(input: UpdateProductInput): Promise<ActionResult> {
  try {
    const supabase = createClient()
    
    const validatedData = productSchema.parse(input)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!adminUser || !['super_admin', 'admin', 'editor'].includes(adminUser.role)) {
      return { success: false, error: 'Sin permisos de administrador' }
    }

    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('id', validatedData.id)
      .single()

    if (!existingProduct) {
      return { success: false, error: 'Producto no encontrado' }
    }

    const slug = generateSlug(validatedData.name)
    const finalPrice = validatedData.discount_percentage
      ? validatedData.base_price * (1 - validatedData.discount_percentage / 100)
      : validatedData.base_price

    const { error: updateError } = await supabase
      .from('products')
      .update({
        brand_id: validatedData.brand_id,
        name: validatedData.name,
        slug: slug,
        description: validatedData.description,
        base_price: validatedData.base_price,
        discount_percentage: validatedData.discount_percentage,
        final_price: Math.round(finalPrice * 100) / 100,
        gender: validatedData.gender,
        category: validatedData.category,
        condition: validatedData.condition,
        status: validatedData.status,
        featured: validatedData.featured,
        sku: validatedData.sku,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.id)

    if (updateError) {
      console.error('Error updating product:', updateError)
      return { success: false, error: 'Error al actualizar el producto' }
    }

    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', validatedData.id)

    await supabase
      .from('product_sizes')
      .delete()
      .eq('product_id', validatedData.id)

    const imageInserts = validatedData.images.map((img, index) => ({
      product_id: validatedData.id,
      image_url: img.url,
      display_order: img.order || index + 1
    }))

    const { error: imagesError } = await supabase
      .from('product_images')
      .insert(imageInserts)

    if (imagesError) {
      return { success: false, error: 'Error al actualizar imágenes' }
    }

    const sizeInserts = validatedData.sizes.map(size => ({
      product_id: validatedData.id,
      size: size.size,
      stock_quantity: size.stock,
      is_available: size.stock > 0
    }))

    const { error: sizesError } = await supabase
      .from('product_sizes')
      .insert(sizeInserts)

    if (sizesError) {
      return { success: false, error: 'Error al actualizar tallas' }
    }

    revalidatePath('/catalogo')
    revalidatePath(`/producto/${slug}`)
    revalidatePath('/')

    return {
      success: true,
      data: {
        id: validatedData.id,
        slug: slug
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => e.message).join(', ')
      }
    }
    
    console.error('Unexpected error updating product:', error)
    return { success: false, error: 'Error inesperado al actualizar el producto' }
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'No autorizado' }
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!adminUser || !['super_admin', 'admin'].includes(adminUser.role)) {
      return { success: false, error: 'Sin permisos para eliminar' }
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (deleteError) {
      console.error('Error deleting product:', deleteError)
      return { success: false, error: 'Error al eliminar el producto' }
    }

    revalidatePath('/catalogo')
    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true, data: { id: productId, slug: '' } }
  } catch (error) {
    console.error('Unexpected error deleting product:', error)
    return { success: false, error: 'Error inesperado al eliminar el producto' }
  }
}
