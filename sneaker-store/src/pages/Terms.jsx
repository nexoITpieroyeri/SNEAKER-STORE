import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, FileText, Calendar, User, Shield, Truck, CreditCard } from 'lucide-react'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Términos y Condiciones</h1>
              <p className="text-slate-500">Última actualización: Enero 2026</p>
            </div>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  1. Aceptación de los Términos
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Al acceder y utilizar Sneaker Store (en adelante, "la Tienda"), usted acepta 
                  cumplir con estos Términos y Condiciones de Uso, así como nuestra Política 
                  de Privacidad. Si no está de acuerdo con alguno de estos términos, por favor 
                  no utilice nuestra plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                  2. Uso del Servicio
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p>Sneaker Store es una plataforma de comercio electrónico especializada en la 
                  venta de zapatillas auténticas de marcas reconocidas como Nike, Adidas, Jordan, 
                  Yeezy, New Balance y Puma.</p>
                  <p>Para realizar compras, el usuario debe:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Proporcionar información veraz y actualizada</li>
                    <li>Mantener la confidencialidad de su cuenta</li>
                    <li>Ser mayor de 18 años o contar con autorización de tutor legal</li>
                    <li>Utilizar el servicio únicamente para fines lícitos</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  3. Proceso de Compra y Pago
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p><strong>3.1 Pedidos por WhatsApp:</strong> Nuestras ventas se realizan 
                  exclusivamente a través de WhatsApp. Al seleccionar un producto, será 
                  redirigido a WhatsApp para completar su pedido.</p>
                  <p><strong>3.2 Precios:</strong> Todos los precios están expresados en Soles 
                  (PEN) e incluyen IGV. Nos reservamos el derecho de modificar precios sin 
                  previo aviso.</p>
                  <p><strong>3.3 Disponibilidad:</strong> Los productos están sujetos a 
                  disponibilidad. En caso de agotarse stock después de confirmar el pedido, 
                  leeremos inmediatamente.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  4. Envíos y Entregas
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p><strong>4.1 Zona de cobertura:</strong> Realizamos envíos a todo el Perú, 
                  incluyendo Lima Metropolitana y provincias.</p>
                  <p><strong>4.2 Tiempos de entrega:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Lima Metropolitana: 1-2 días hábiles</li>
                    <li>Provincias: 3-5 días hábiles (varía según ubicación)</li>
                  </ul>
                  <p><strong>4.3 Costos de envío:</strong> Los gastos de envío se coordinan 
                  directamente por WhatsApp al momento de confirmar el pedido.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  5. Garantía y Autenticidad
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p><strong>5.1 Productos 100% auténticos:</strong> Garantizamos que todos 
                  nuestros productos son originales y provienen de fuentes autorizadas.</p>
                  <p><strong>5.2 Garantía:</strong> Todos los productos tienen garantía por 
                  defectos de fabricación. No cubrimos daños por mal uso.</p>
                  <p><strong>5.3 Devoluciones:</strong> Una ves realizada la compra, el cliente no puede
                  hacer la devolucion del producto</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  6. Protección de Datos Personales
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p>Sus datos personales serán utilizados únicamente para:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Procesar y gestionar su pedido</li>
                    <li>Coordinar entregas y comunicaciones</li>
                    <li>Mejorar nuestros servicios</li>
                    <li>Enviar promociones (solo si usted lo autoriza)</li>
                  </ul>
                  <p>No compartiremos sus datos con terceros sin su consentimiento. 
                  Para más información, consulte nuestra Política de Privacidad.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  7. Limitación de Responsabilidad
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Sneaker Store no se hace responsable por: (a) retrasos en entregas 
                  causados por el courier; (b) daños durante el transporte (debe verificar 
                  el producto al recibirlo); (c) disponibilidad de productos; (d) 
                  pérdidas o daños por uso indebido de los productos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                  8. Modificaciones
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                  Los cambios entrarán en vigor inmediatamente después de su publicación en 
                  esta página. Es responsabilidad del usuario revisar periódicamente estos términos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  9. Contacto
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Para consultas sobre estos términos o cualquier asunto relacionado con 
                  su compra, contáctenos por WhatsApp o al correo electrónico indicado 
                  en nuestra sección de contacto.
                </p>
              </section>

              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-slate-500 text-center">
                  © 2026 Sneaker Store. Todos los derechos reservados.<br />
                  Este documento constituye un acuerdo legal entre usted y Sneaker Store.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
