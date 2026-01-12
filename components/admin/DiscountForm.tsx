'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui/primitives'

export default function DiscountForm() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    percentage: '',
    valid_until: '',
    usage_limit: '',
    min_purchase: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from('discount_codes')
      .insert({
        code: formData.code.toUpperCase(),
        percentage: parseFloat(formData.percentage),
        valid_until: formData.valid_until,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null,
        is_active: true,
        used_count: 0,
      })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Código creado exitosamente' })
      setFormData({ code: '', percentage: '', valid_until: '', usage_limit: '', min_purchase: '' })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">Crear Código de Descuento</h3>

      <Input
        label="Código"
        value={formData.code}
        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
        placeholder="VERANO20"
        required
      />

      <Input
        label="Porcentaje de descuento (%)"
        type="number"
        min="1"
        max="100"
        value={formData.percentage}
        onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
        required
      />

      <Input
        label="Fecha de vencimiento"
        type="date"
        value={formData.valid_until}
        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
        required
      />

      <Input
        label="Límite de usos"
        type="number"
        min="1"
        value={formData.usage_limit}
        onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
        placeholder="Ilimitado"
      />

      <Input
        label="Compra mínima (MXN)"
        type="number"
        min="0"
        value={formData.min_purchase}
        onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })}
        placeholder="0"
      />

      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Crear Código
      </Button>
    </form>
  )
}
