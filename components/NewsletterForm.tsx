'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Input } from '@/components/ui/primitives'

export function NewsletterForm() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })

    if (error) {
      setMessage({ type: 'error', 'El email ya está registrado o ocurrió un error' })
    } else {
      setMessage({ type: 'success', '¡Te has suscrito correctamente!' })
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" loading={loading}>
          Suscribirse
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </form>
  )
}
