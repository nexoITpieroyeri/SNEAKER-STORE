import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const brandSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  slug: z.string().min(1, 'El slug es requerido').max(100).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  logo_url: z.string().url('URL inválida').optional().nullable(),
})

type CreateBrandInput = z.infer<typeof brandSchema>

interface ActionResult {
  success: boolean
  data?: { id: string; slug: string }
  error?: string
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function createBrand(input: CreateBrandInput): Promise<ActionResult> {
  try {
    const supabase = createClient()
    
    const validatedData = brandSchema.parse(input)
    
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
      return { success: false, error: 'Sin permisos de administrador' }
    }

    const slug = validatedData.slug || generateSlug(validatedData.name)

    const { data: existingBrand } = await supabase
      .from('brands')
      .select('id')
      .or(`name.eq.${validatedData.name},slug.eq.${slug}`)
      .single()

    if (existingBrand) {
      return { success: false, error: 'Ya existe una marca con ese nombre o slug' }
    }

    const { data: brand, error } = await supabase
      .from('brands')
      .insert({
        name: validatedData.name,
        slug: slug,
        logo_url: validatedData.logo_url,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating brand:', error)
      return { success: false, error: 'Error al crear la marca' }
    }

    revalidatePath('/admin/brands')
    revalidatePath('/catalogo')

    return { success: true, data: { id: brand.id, slug: brand.slug } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') }
    }
    console.error('Unexpected error creating brand:', error)
    return { success: false, error: 'Error inesperado' }
  }
}

export async function updateBrand(id: string, input: CreateBrandInput): Promise<ActionResult> {
  try {
    const supabase = createClient()
    
    const validatedData = brandSchema.parse(input)
    
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
      return { success: false, error: 'Sin permisos' }
    }

    const slug = validatedData.slug || generateSlug(validatedData.name)

    const { data: brand, error } = await supabase
      .from('brands')
      .update({
        name: validatedData.name,
        slug: slug,
        logo_url: validatedData.logo_url,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating brand:', error)
      return { success: false, error: 'Error al actualizar la marca' }
    }

    revalidatePath('/admin/brands')
    revalidatePath('/catalogo')

    return { success: true, data: { id: brand.id, slug: brand.slug } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') }
    }
    console.error('Unexpected error updating brand:', error)
    return { success: false, error: 'Error inesperado' }
  }
}

export async function deleteBrand(id: string): Promise<ActionResult> {
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

    if (!adminUser || adminUser.role !== 'super_admin') {
      return { success: false, error: 'Solo super_admin puede eliminar marcas' }
    }

    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting brand:', error)
      return { success: false, error: 'Error al eliminar la marca' }
    }

    revalidatePath('/admin/brands')
    revalidatePath('/catalogo')

    return { success: true, data: { id, slug: '' } }
  } catch (error) {
    console.error('Unexpected error deleting brand:', error)
    return { success: false, error: 'Error inesperado' }
  }
}

export async function getBrands() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data
}
