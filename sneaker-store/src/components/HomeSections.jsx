import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Star, Zap, Shield, Truck } from 'lucide-react'
import { Button } from './ui/Button'
import { ProductCard } from './ProductCard'
import { handleWhatsAppClick } from '../lib/whatsapp'

export function Hero() {
  const handleContact = async () => {
    await handleWhatsAppClick({ type: 'general' })
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full text-sm mb-6">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span>Nuevos modelos disponibles</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Encuentra tu par
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              soñado
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-lg">
            Zapatillas auténticas de las mejores marcas. Nike, Adidas, Jordan y más. 
            Envío a todo el país.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/catalogo">
              <Button size="lg" className="gap-2 bg-white text-slate-900 hover:bg-slate-100">
                Ver catálogo <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <button
              onClick={handleContact}
              className="inline-flex items-center"
            >
              <Button size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                <MessageCircle className="h-5 w-5 text-green-400" /> Contactar
              </Button>
            </button>
          </div>

          <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>100% Auténticos</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Truck className="h-5 w-5 text-blue-400" />
              <span>Envío a todo el país</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>+500 clientes satisfechos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturedSection({ title, products, link, loading }) {
  if (loading) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
              <p className="text-slate-500 mt-1">Las mejores opciones para ti</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-slate-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            <p className="text-slate-500 mt-1">Las mejores opciones para ti</p>
          </div>
          {link && (
            <Link 
              to={link} 
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Ver todos los productos <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <p>No hay productos disponibles por el momento.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function BrandsSection({ brands, loading }) {
  if (loading) {
    return (
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Nuestras marcas</h2>
            <p className="text-slate-500">Las marcas más populares del momento</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse p-6 bg-white rounded-xl">
                <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-3"></div>
                <div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <Link to="/catalogo" className="group">
            <h2 className="text-2xl md:text-3xl font-bold group-hover:text-blue-600 transition-colors">
              Nuestras marcas
            </h2>
            <p className="text-slate-500 mt-1 group-hover:text-slate-600 transition-colors">
              Las marcas más populares del momento
            </p>
          </Link>
          <Link 
            to="/catalogo" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Ver todas las marcas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands?.map(brand => (
            <Link
              key={brand.id}
              to={`/catalogo?brand=${brand.slug}`}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="h-8 object-contain" />
                ) : (
                  <span className="font-bold text-lg text-slate-700">{brand.name[0]}</span>
                )}
              </div>
              <span className="font-medium text-slate-700">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  const handleWhatsApp = async () => {
    await handleWhatsAppClick({ type: 'general' })
  }

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="h-4 w-4" />
            <span>Atención personalizada</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Contáctanos directamente por WhatsApp y te ayudamos a encontrar el par perfecto. 
            También podemos avisarte cuando lleguen los modelos que te interesan.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Chatear por WhatsApp
            </button>
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Ver catálogo completo
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-10 pt-10 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-2xl">📦</span>
              <span>Envío a todo el país</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-2xl">✅</span>
              <span>Productos 100% originales</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="text-2xl">💬</span>
              <span>Atención inmediata</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Package({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}
