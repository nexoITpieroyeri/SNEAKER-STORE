import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Shield, Eye, Lock, Mail, Smartphone, Database, User } from 'lucide-react'

export function PrivacyPage() {
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
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Privacidad</h1>
              <p className="text-slate-500">Última actualización: Enero 2026</p>
            </div>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  1. Introducción
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  En Sneaker Store, respetamos su privacidad y nos comprometemos a proteger 
                  sus datos personales. Esta Política de Privacidad explica cómo recopilamos, 
                  utilizamos y protegemos la información que nos proporciona.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  2. Datos que Recopilamos
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p>Podemos recopilar los siguientes datos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Información de contacto:</strong> Nombre, correo electrónico, 
                    número de teléfono, dirección de entrega.</li>
                    <li><strong>Información de pago:</strong> Datos de transacción (procesados 
                    de forma segura a través de proveedores de pago).</li>
                    <li><strong>Información de navegación:</strong> Dirección IP, navegador 
                    utilizado, páginas visitadas.</li>
                    <li><strong>Historial de pedidos:</strong> Productos adquiridos, preferencias.</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  3. Cómo Utilizamos sus Datos
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p>Sus datos personales se utilizan para:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Procesar y entregar sus pedidos</li>
                    <li>Coordinar envíos y comunicaciones sobre su compra</li>
                    <li>Proporcionar atención al cliente</li>
                    <li>Mejorar nuestra tienda y servicios</li>
                    <li>Enviar promociones y ofertas (solo si usted lo autoriza)</li>
                    <li>Cumplir con obligaciones legales</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-500" />
                  4. Protección de sus Datos
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p>Implementamos medidas de seguridad técnicas y organizativas para 
                  proteger sus datos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encriptación de datos sensibles</li>
                    <li>Conexiones seguras (HTTPS)</li>
                    <li>Acceso restringido a información confidencial</li>
                    <li>Monitoreo continuo de nuestra plataforma</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  5. Compartir Información con Terceros
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  No vendemos ni alquilamos sus datos personales a terceros. Solo compartimos 
                  su información con: (a) proveedores de servicios de envío para entregas; 
                  (b) autoridades legales cuando sea requerido por ley; (c) procesadores de 
                  pago para transacciones seguras.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  6. Sus Derechos
                </h2>
                <div className="text-slate-600 leading-relaxed space-y-3">
                  <p>Como usuario, usted tiene los siguientes derechos:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales.</li>
                    <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
                    <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos.</li>
                    <li><strong>Opt-out:</strong> Darse de baja de comunicaciones promocionales.</li>
                  </ul>
                  <p>Para ejercer estos derechos, contáctenos por WhatsApp o correo electrónico.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  7. Cookies y Tecnologías Similares
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Nuestra tienda utiliza cookies para mejorar su experiencia. Las cookies 
                  nos ayudan a: recordar sus preferencias, analizar el tráfico del sitio, 
                  y ofrecer productos relevantes. Puede禁用 cookies en su navegador, 
                  aunque algunas funciones de la tienda pueden verse afectadas.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  8. Retención de Datos
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Conservamos sus datos personales durante el tiempo necesario para cumplir 
                  con los fines descritos en esta política, o según lo requiera la ley. 
                  Los datos de transacciones se conservan por razones legales y fiscales.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  9. Menores de Edad
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Nuestra tienda no está dirigida a menores de 18 años. No recopilamos 
                  intencionalmente datos de menores. Si cree que hemos recopilado datos 
                  de un menor, contáctenos para eliminar dicha información.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-500" />
                  10. Cambios a esta Política
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Podemos actualizar esta Política de Privacidad periódicamente. Los cambios 
                  se publicarán en esta página con una fecha de actualización revisada. 
                  Le recomendamos revisar esta política regularmente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  11. Contacto
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Si tiene preguntas sobre esta Política de Privacidad o sobre cómo 
                  manejamos sus datos, contáctenos:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-600">
                  <li>Por WhatsApp: A través de nuestro número de contacto</li>
                  <li>Por correo: contacto@sneakerstore.pe</li>
                </ul>
              </section>

              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <p className="text-sm text-slate-500 text-center">
                  © 2026 Sneaker Store. Todos los derechos reservados.<br />
                  Esta política complementa nuestros Términos y Condiciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
