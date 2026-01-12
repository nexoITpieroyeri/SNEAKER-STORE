import { Link } from 'react-router-dom'
import { ShoppingBag, Instagram, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SNEAKER STORE</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tu tienda de zapatillas auténticas. Encuentra los mejores modelos de las marcas más exclusivas del mundo.
            </p>
            <div className="flex gap-4 mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500 hover:text-white transition-all"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Catálogo</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <Link to="/catalogo" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link to="/catalogo?gender=men" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Hombre
                </Link>
              </li>
              <li>
                <Link to="/catalogo?gender=women" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Mujer
                </Link>
              </li>
              <li>
                <Link to="/catalogo?category=limited_edition" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Limited Edition
                </Link>
              </li>
              <li>
                <Link to="/catalogo?brand=nike" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Nike
                </Link>
              </li>
              <li>
                <Link to="/catalogo?brand=adidas" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Adidas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Atención al Cliente</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Guía de tallas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Política de devolución
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Rastrear pedido
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Contáctanos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">Contacto</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Ciudad de México, México</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+521234567890" className="hover:text-white transition-colors">
                  +52 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:contacto@sneakerstore.com" className="hover:text-white transition-colors">
                  contacto@sneakerstore.com
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-slate-800 rounded-xl">
              <p className="text-sm text-slate-300 mb-2">¿Dudas sobre un producto?</p>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                Chatea con nosotros
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Sneaker Store. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Términos y condiciones</a>
              <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
