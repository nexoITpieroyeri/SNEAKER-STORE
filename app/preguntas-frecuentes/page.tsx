import { createClient } from '@/lib/supabase/server'

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    category: 'Compras',
    question: '¿Cómo compro en Sneaker Store?',
    answer: 'Navega por nuestro catálogo, selecciona el producto que te gusta y haz clic en "Consultar por WhatsApp". Te contactaremos para confirmar disponibilidad, talla y coordinar el pago y envío.'
  },
  {
    category: 'Compras',
    question: '¿Necesito cuenta para comprar?',
    answer: 'No necesitas registrarte para navegar y ver productos. Solo te pedimos tus datos de contacto cuando finalices tu compra por WhatsApp.'
  },
  {
    category: 'Pagos',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos transferencias bancarias, depósitos, MercadoPago y pago contra entrega en área metropolitana. Te mostraremos todas las opciones al contactarte por WhatsApp.'
  },
  {
    category: 'Envíos',
    question: '¿Hacen envíos a toda México?',
    answer: 'Sí, enviamos a toda la República Mexicana. El costo de envío depende de tu ubicación y se coordina directamente por WhatsApp.'
  },
  {
    category: 'Envíos',
    question: '¿Cuánto tardan en llegar los productos?',
    answer: 'Los envíos nacionales tardan 2-5 días hábiles aproximadamente. Te compartiremos el número de rastreo una vez confirmado el envío.'
  },
  {
    category: 'Productos',
    question: '¿Son productos auténticos?',
    answer: 'Sí, 100% auténticos. Solo vendemos productos originales de las marcas oficiales. Cada producto es verificado antes de ser publicado.'
  },
  {
    category: 'Productos',
    question: '¿Puedo devolver un producto?',
    answer: 'Sí, tienes 5 días para devolver el producto si no te queda o no cumple con tus expectativas. El producto debe estar en las mismas condiciones que lo recibiste.'
  },
  {
    category: 'Tallas',
    question: '¿Cómo sé mi talla?',
    answer: 'Consulta nuestra guía de tallas en la página de cada producto. Si tienes dudas, contáctanos por WhatsApp y te ayudamos a elegir la talla correcta.'
  },
  {
    category: 'Garantía',
    question: '¿Tienen garantía?',
    answer: 'Todos nuestros productos tienen garantía de autenticidad. Además, si el producto llega dañado o no es como se describe, te hacemos el cambio o reembolso.'
  }
]

export default async function FAQPage() {
  const supabase = createClient()
  const { data: settings } = await supabase.from('site_settings').select('*')

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = []
    }
    acc[faq.category].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Preguntas Frecuentes</h1>
          <p className="text-gray-600">Todo lo que necesitas saber sobre comprar en Sneaker Store</p>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {category}
              </h2>
              <div className="space-y-4">
                {categoryFaqs.map((faq, index) => (
                  <details key={index} className="bg-white rounded-xl shadow-sm group">
                    <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50 transition-colors rounded-xl">
                      {faq.question}
                      <svg className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-sm p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">¿No encontraste tu respuesta?</h3>
          <p className="text-gray-600 mb-6">Contáctanos directamente y te responderemos a la brevedad</p>
          <a
            href="/contacto"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Contactar
          </a>
        </div>
      </div>
    </div>
  )
}
