import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ShoppingBag, Instagram, MessageCircle, Mail, MapPin, Phone, Truck, Shield, RotateCcw, Ruler, Package, Headphones } from 'lucide-react'
import { handleWhatsAppClick } from '../lib/whatsapp'
import { supabase } from '../lib/supabase'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'default')
          .single()
        
        setSettings(data)
      } catch (err) {
        console.error('Error loading settings:', err)
      }
    }
    loadSettings()
  }, [])

  const handleContactWhatsApp = async () => {
    await handleWhatsAppClick({
      type: 'general'
    })
  }

  const formatPhone = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `+51 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 10)} ${cleaned.slice(10)}`
    }
    return phone
  }

  const siteName = settings?.site_name || 'Sneaker Store'
  const siteEmail = settings?.contact_email || 'contacto@sneakerstore.pe'
  const whatsappNumber = settings?.whatsapp_number || '51987654321'
  const instagramUrl = settings?.instagram_url || '#'
  const facebookUrl = settings?.facebook_url || '#'
  const aboutText = settings?.about_text || 'Tu tienda de zapatillas auténticas. Encuentra los mejores modelos de las marcas más exclusivas del mundo.'

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">{siteName}</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {aboutText}
            </p>
            <div className="flex gap-3">
              {instagramUrl !== '#' && (
                <a 
                  href={instagramUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {facebookUrl !== '#' && (
                <a 
                  href={facebookUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                  title="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              <button
                onClick={handleContactWhatsApp}
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-all"
                title="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Catálogo</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link to="/catalogo?gender=men" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Hombre
                </Link>
              </li>
              <li>
                <Link to="/catalogo?gender=women" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Mujer
                </Link>
              </li>
              <li>
                <Link to="/catalogo?category=limited_edition" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Limited Edition
                </Link>
              </li>
              <li>
                <Link to="/catalogo?brand=nike" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Nike
                </Link>
              </li>
              <li>
                <Link to="/catalogo?brand=adidas" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Adidas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Atención al Cliente</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <Link to="/mis-pedidos" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Mis Pedidos
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Guía de tallas
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleContactWhatsApp}
                  className="hover:text-white transition-colors flex items-center gap-2 text-left"
                >
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Preguntas frecuentes
                </button>
              </li>
              <li>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  <span>Envío: 2-5 días hábiles</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  <span>Devoluciones: 30 días</span>
                </div>
              </li>
              <li>
                <button 
                  onClick={handleContactWhatsApp}
                  className="hover:text-white transition-colors flex items-center gap-2 text-left"
                >
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  Contáctanos
                </button>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Truck className="h-4 w-4 text-blue-400" />
                <span>Envío a todo el país</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="h-4 w-4 text-green-400" />
                <span>100% Originales</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <RotateCcw className="h-4 w-4 text-purple-400" />
                <span>30 días de devolución</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Contáctanos</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <Headphones className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-300">Atención inmediata</p>
                  <p className="text-xs text-slate-500">WhatsApp: {formatPhone(whatsappNumber)}</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${siteEmail}`} className="hover:text-white transition-colors text-sm break-all">
                  {siteEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <button 
                  onClick={handleContactWhatsApp}
                  className="hover:text-white transition-colors text-sm"
                >
                  Chatea con nosotros
                </button>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-green-400" />
                <span className="font-medium text-white">¿Necesitas ayuda?</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Nuestro equipo está listo para ayudarte con cualquier duda sobre productos, tallas o pedidos.
              </p>
              <button
                onClick={handleContactWhatsApp}
                className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Contactar por WhatsApp
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} {siteName}. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link to="/terminos" className="hover:text-white transition-colors">Términos y condiciones</Link>
              <Link to="/privacidad" className="hover:text-white transition-colors">Política de privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
