export default function SizeGuidePage() {
  const sizeCharts = {
    nike: {
      men: [
        { us: '6', eu: '39', cm: '24' },
        { us: '6.5', eu: '39.5', cm: '24.5' },
        { us: '7', eu: '40', cm: '25' },
        { us: '7.5', eu: '40.5', cm: '25.5' },
        { us: '8', eu: '41', cm: '26' },
        { us: '8.5', eu: '42', cm: '26.5' },
        { us: '9', eu: '42.5', cm: '27' },
        { us: '9.5', eu: '43', cm: '27.5' },
        { us: '10', eu: '44', cm: '28' },
        { us: '10.5', eu: '44.5', cm: '28.5' },
        { us: '11', eu: '45', cm: '29' },
        { us: '11.5', eu: '45.5', cm: '29.5' },
        { us: '12', eu: '46', cm: '30' },
      ],
      women: [
        { us: '5', eu: '35.5', cm: '22' },
        { us: '5.5', eu: '36', cm: '22.5' },
        { us: '6', eu: '36.5', cm: '23' },
        { us: '6.5', eu: '37.5', cm: '23.5' },
        { us: '7', eu: '38', cm: '24' },
        { us: '7.5', eu: '38.5', cm: '24.5' },
        { us: '8', eu: '39', cm: '25' },
        { us: '8.5', eu: '40', cm: '25.5' },
        { us: '9', eu: '40.5', cm: '26' },
        { us: '9.5', eu: '41', cm: '26.5' },
        { us: '10', eu: '42', cm: '27' },
        { us: '10.5', eu: '42.5', cm: '27.5' },
        { us: '11', eu: '43', cm: '28' },
      ],
    },
    adidas: {
      men: [
        { us: '6', eu: '38 2/3', cm: '24' },
        { us: '6.5', eu: '39 1/3', cm: '24.5' },
        { us: '7', eu: '40', cm: '25' },
        { us: '7.5', eu: '40 2/3', cm: '25.5' },
        { us: '8', eu: '41 1/3', cm: '26' },
        { us: '8.5', eu: '42', cm: '26.5' },
        { us: '9', eu: '42 2/3', cm: '27' },
        { us: '9.5', eu: '43 1/3', cm: '27.5' },
        { us: '10', eu: '44', cm: '28' },
        { us: '10.5', eu: '44 2/3', cm: '28.5' },
        { us: '11', eu: '45 1/3', cm: '29' },
        { us: '11.5', eu: '46', cm: '29.5' },
        { us: '12', eu: '46 2/3', cm: '30' },
      ],
      women: [
        { us: '5', eu: '36', cm: '22' },
        { us: '5.5', eu: '36 2/3', cm: '22.5' },
        { us: '6', eu: '37 1/3', cm: '23' },
        { us: '6.5', eu: '38', cm: '23.5' },
        { us: '7', eu: '38 2/3', cm: '24' },
        { us: '7.5', eu: '39 1/3', cm: '24.5' },
        { us: '8', eu: '40', cm: '25' },
        { us: '8.5', eu: '40 2/3', cm: '25.5' },
        { us: '9', eu: '41 1/3', cm: '26' },
        { us: '9.5', eu: '42', cm: '26.5' },
        { us: '10', eu: '42 2/3', cm: '27' },
        { us: '10.5', eu: '43 1/3', cm: '27.5' },
        { us: '11', eu: '44', cm: '28' },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guía de Tallas</h1>
          <p className="text-gray-600">Encuentra tu talla perfecta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cómo medir tu pie</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-gray-600">
              <p>1. Coloca una hoja de papel en el suelo, contra la pared</p>
              <p>2. Pon tu pie sobre la hoja, con el talón contra la pared</p>
              <p>3. Marca con un lápiz la punta de tu dedo más largo</p>
              <p>4. Mide la distancia desde el borde del papel hasta la marca</p>
              <p>5. Compara con nuestra tabla de conversiones</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-32 h-32 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                <p className="text-sm text-gray-500 mt-2">Ilustración de medición</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-black text-white px-6 py-4">
              <h3 className="text-lg font-semibold">Nike</h3>
            </div>
            
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Hombres</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2">US</th>
                      <th className="pb-2">EU</th>
                      <th className="pb-2">CM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sizeCharts.nike.men.map((size) => (
                      <tr key={size.us}>
                        <td className="py-2">{size.us}</td>
                        <td className="py-2">{size.eu}</td>
                        <td className="py-2">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-medium text-gray-900 mb-4 mt-6">Mujeres</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2">US</th>
                      <th className="pb-2">EU</th>
                      <th className="pb-2">CM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sizeCharts.nike.women.map((size) => (
                      <tr key={size.us}>
                        <td className="py-2">{size.us}</td>
                        <td className="py-2">{size.eu}</td>
                        <td className="py-2">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-black text-white px-6 py-4">
              <h3 className="text-lg font-semibold">Adidas</h3>
            </div>
            
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Hombres</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2">US</th>
                      <th className="pb-2">EU</th>
                      <th className="pb-2">CM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sizeCharts.adidas.men.map((size) => (
                      <tr key={size.us}>
                        <td className="py-2">{size.us}</td>
                        <td className="py-2">{size.eu}</td>
                        <td className="py-2">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-medium text-gray-900 mb-4 mt-6">Mujeres</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-2">US</th>
                      <th className="pb-2">EU</th>
                      <th className="pb-2">CM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sizeCharts.adidas.women.map((size) => (
                      <tr key={size.us}>
                        <td className="py-2">{size.us}</td>
                        <td className="py-2">{size.eu}</td>
                        <td className="py-2">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Consejo</h4>
          <p className="text-yellow-700">
            Si estás entre dos tallas, te recomendamos elegir la talla más grande. 
            ¿Tienes dudas? Contáctanos por WhatsApp y te ayudamos a elegir la talla perfecta.
          </p>
        </div>
      </div>
    </div>
  )
}
