import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const reservationSchema = z.object({
  product_id: z.string().uuid(),
  size: z.string(),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().min(10),
  reservation_days: z.number().min(1).max(7).default(3),
})

interface ReservationResult {
  success: boolean
  data?: { id: string; expires_at: string }
  error?: string
}

export async function createReservation(input: {
  product_id: string
  size: string
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_days?: number
}): Promise<ReservationResult> {
  try {
    const supabase = createClient()
    const validatedData = reservationSchema.parse(input)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (validatedData.reservation_days || 3))

    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        product_id: validatedData.product_id,
        size: validatedData.size,
        customer_name: validatedData.customer_name,
        customer_email: validatedData.customer_email,
        customer_phone: validatedData.customer_phone,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: 'Error al crear la reserva' }
    }

    await supabase
      .from('product_sizes')
      .update({ stock_quantity: (supabase as any).raw('stock_quantity - 1') })
      .eq('product_id', validatedData.product_id)
      .eq('size', validatedData.size)

    revalidatePath('/admin')
    return { success: true, data: { id: (reservation as any).id, expires_at: (reservation as any).expires_at } }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') }
    }
    return { success: false, error: 'Error inesperado' }
  }
}

export async function cancelReservation(reservationId: string) {
  const supabase = createClient()

  const { data: reservation } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId)
    .single()

  if (reservation) {
    await supabase
      .from('product_sizes')
      .update({ stock_quantity: (supabase as any).raw('stock_quantity + 1') })
      .eq('product_id', (reservation as any).product_id)
      .eq('size', (reservation as any).size)

    await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
  }

  revalidatePath('/admin')
}

export async function confirmReservation(reservationId: string) {
  const supabase = createClient()

  await supabase
    .from('reservations')
    .update({ status: 'confirmed' })
    .eq('id', reservationId)

  revalidatePath('/admin')
}

export async function getReservations() {
  const supabase = createClient()

  const { data } = await supabase
    .from('reservations')
    .select(`
      *,
      product:products(id, name, slug)
    `)
    .order('created_at', { ascending: false })

  return data || []
}
