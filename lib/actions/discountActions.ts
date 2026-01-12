import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const discountCodeSchema = z.object({
  code: z.string().min(3, 'Código debe tener al menos 3 caracteres').max(20),
  percentage: z.number().min(1).max(100),
  valid_from: z.string().optional(),
  valid_until: z.string(),
  usage_limit: z.number().min(1).optional(),
  min_purchase: z.number().min(0).optional(),
  is_active: z.boolean().default(true),
})

type CreateDiscountInput = z.infer<typeof discountCodeSchema>

interface DiscountResult {
  success: boolean
  data?: { id: string; code: string }
  error?: string
}

export async function createDiscountCode(input: CreateDiscountCode): Promise<DiscountResult> {
  try {
    const supabase = createClient()
    const validatedData = discountCodeSchema.parse(input)

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

    const { data: existing } = await supabase
      .from('discount_codes')
      .select('id')
      .eq('code', validatedData.code.toUpperCase())
      .single()

    if (existing) {
      return { success: false, error: 'Este código ya existe' }
    }

    const { data: discount, error } = await supabase
      .from('discount_codes')
      .insert({
        code: validatedData.code.toUpperCase(),
        percentage: validatedData.percentage,
        valid_from: validatedData.valid_from || new Date().toISOString(),
        valid_until: validatedData.valid_until,
        usage_limit: validatedData.usage_limit,
        min_purchase: validatedData.min_purchase,
        is_active: validatedData.is_active,
        used_count: 0,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: 'Error al crear el código' }
    }

    revalidatePath('/admin')
    return { success: true, data: { id: discount.id, code: discount.code } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') }
    }
    return { success: false, error: 'Error inesperado' }
  }
}

export async function validateDiscountCode(
  code: string,
  purchaseAmount: number
): Promise<{ valid: boolean; percentage?: number; error?: string }> {
  try {
    const supabase = createClient()

    const { data: discount } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (!discount) {
      return { valid: false, error: 'Código no válido' }
    }

    const now = new Date()
    const validUntil = new Date(discount.valid_until)
    const validFrom = new Date(discount.valid_from)

    if (now > validUntil) {
      return { valid: false, error: 'Este código ha expirado' }
    }

    if (now < validFrom) {
      return { valid: false, error: 'Este código aún no está vigente' }
    }

    if (discount.usage_limit && discount.used_count >= discount.usage_limit) {
      return { valid: false, error: 'Este código ha alcanzado su límite de uso' }
    }

    if (discount.min_purchase && purchaseAmount < discount.min_purchase) {
      return { valid: false, error: `Minimum purchase: $${discount.min_purchase}` }
    }

    return { valid: true, percentage: discount.percentage }
  } catch (error) {
    return { valid: false, error: 'Error al validar el código' }
  }
}

export async function useDiscountCode(code: string) {
  const supabase = createClient()

  await supabase
    .from('discount_codes')
    .update({ used_count: supabase.raw('used_count + 1') })
    .eq('code', code.toUpperCase())

  revalidatePath('/admin')
}
