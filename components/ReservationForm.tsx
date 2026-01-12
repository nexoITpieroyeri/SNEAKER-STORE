'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui/primitives'

export default function ReservationForm({ productId, productName, sizes }: {
  productId: string
  productName: string
  sizes: { size: string; stock: number }[]
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    size: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('reservations')
      .insert({
        product_id: productId,
        size: formData.size,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      })

    if (error) {
      alert('Error al hacer la reserva')
    } else {
      setSubmitted(true)
      await supabase
        .from('product_sizes')
        .update({ stock_quantity: formData.stock - 1 })
        .eq('product_id', productId)
        .eq('size', formData.size)
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-2">¡Reserva confirmada!</h3>
        <p className="text-green-700 mb-4">
          Tu talla {formData.size} ha sido apartada por 72 horas.
          Te contactaremos para completar la compra.
        </p>
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Continuar por WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">Apartar producto (72 hrs)</h3>
      
      <select
        value={formData.size}
        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
        required
      >
        <option value="">Seleccionar talla</option>
        {sizes.filter(s => s.stock > 0).map((size) => (
          <option key={size.size} value={size.size}>
            {size.size} ({size.stock} disponibles)
          </option>
        ))}
      </select>

      <Input
        label="Nombre"
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <Input
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <Input
        label="WhatsApp"
        type="tel"
        required
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />

      <Button type="submit" loading={loading} className="w-full">
        Apartar Ahora
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Tu talla se apartará por 72 horas. Te contactaremos para completar la compra.
      </p>
    </form>
  )
}
