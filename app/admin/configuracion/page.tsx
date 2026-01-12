'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Config {
  id: string
  key: string
  value: string
  description: string
}

export default function ConfiguracionAdmin() {
  const supabase = createClient()
  const [configs, setConfigs] = useState<Config[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const defaultConfigs = [
    { key: 'whatsapp_number', value: '', description: 'Número de WhatsApp (formato: 519999999999)' },
    { key: 'whatsapp_message', value: 'Hola, estoy interesado en este producto', description: 'Mensaje predefinido de WhatsApp' },
    { key: 'store_name', value: 'Sneaker Store', description: 'Nombre de la tienda' },
    { key: 'contact_email', value: '', description: 'Email de contacto' },
    { key: 'items_per_page', value: '12', description: 'Productos por página' },
  ]

  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async () => {
    const { data } = await supabase.from('site_settings').select('*')
    if (data && data.length > 0) {
      setConfigs(data)
    } else {
      const newConfigs = defaultConfigs.map(c => ({ ...c, id: c.key }))
      setConfigs(newConfigs)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    for (const config of configs) {
      await supabase.from('site_settings').upsert({
        key: config.key,
        value: config.value,
        description: config.description
      })
    }

    setMessage({ type: 'success', text: 'Configuración guardada correctamente' })
    setSaving(false)
  }

  const handleChange = (key: string, value: string) => {
    setConfigs(configs.map(c => c.key === key ? { ...c, value } : c))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Configuración</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">WhatsApp</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de WhatsApp
              </label>
              <input
                type="text"
                value={configs.find(c => c.key === 'whatsapp_number')?.value || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                placeholder="519999999999"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: código de país + número (sin espacios ni símbolos)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje predefinido
              </label>
              <textarea
                value={configs.find(c => c.key === 'whatsapp_message')?.value || ''}
                onChange={(e) => handleChange('whatsapp_message', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        <hr />

        <div>
          <h2 className="text-lg font-semibold mb-4">Tienda</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la tienda
              </label>
              <input
                type="text"
                value={configs.find(c => c.key === 'store_name')?.value || ''}
                onChange={(e) => handleChange('store_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de contacto
              </label>
              <input
                type="email"
                value={configs.find(c => c.key === 'contact_email')?.value || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>

        <hr />

        <div>
          <h2 className="text-lg font-semibold mb-4">Catálogo</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Productos por página
            </label>
            <select
              value={configs.find(c => c.key === 'items_per_page')?.value || '12'}
              onChange={(e) => handleChange('items_per_page', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              <option value="8">8 productos</option>
              <option value="12">12 productos</option>
              <option value="16">16 productos</option>
              <option value="24">24 productos</option>
              <option value="48">48 productos</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
