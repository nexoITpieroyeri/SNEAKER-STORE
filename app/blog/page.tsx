import { createClient } from '@/lib/supabase/server'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_image: string
  category: string
  created_at: string
  author: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Las 10 Zapatillas Más Icónicas de 2024',
    slug: 'zapatillas-mas-iconicas-2024',
    excerpt: 'Descubre las zapatillas que marcaron tendencia este año y por qué son tan especiales.',
    cover_image: '/blog-1.jpg',
    category: 'Tendencias',
    created_at: '2024-12-01',
    author: 'Sneaker Store'
  },
  {
    id: '2',
    title: 'Cómo Cuidar Tus Sneakers de Colección',
    slug: 'como-cuidar-sneakers-coleccion',
    excerpt: 'Guía completa para mantener tus zapatillas favoritas en perfecto estado por años.',
    cover_image: '/blog-2.jpg',
    category: 'Cuidado',
    created_at: '2024-11-20',
    author: 'Sneaker Store'
  },
  {
    id: '3',
    title: 'Guía de Tallas: Cómo Encontrar Tu Fit Perfecto',
    slug: 'guia-tallas-zapatillas',
    excerpt: 'Nunca más compres una talla incorrecta. Aprende a medir tu pie y elegir la talla ideal.',
    cover_image: '/blog-3.jpg',
    category: 'Guía',
    created_at: '2024-11-10',
    author: 'Sneaker Store'
  },
  {
    id: '4',
    title: 'Nike Air Jordan: Historia de una Leyenda',
    slug: 'historia-nike-air-jordan',
    excerpt: 'Desde su creación en 1984 hasta hoy, la historia detrás de las zapatillas más famosas del mundo.',
    cover_image: '/blog-4.jpg',
    category: 'Historia',
    created_at: '2024-10-28',
    author: 'Sneaker Store'
  },
  {
    id: '5',
    title: 'Cómo Combinar Zapatillas con Tu Outfit',
    slug: 'combinar-zapatillas-outfit',
    excerpt: 'Ideas y consejos para usar tus sneakers con cualquier estilo, desde casual hasta elegante.',
    cover_image: '/blog-5.jpg',
    category: 'Estilo',
    created_at: '2024-10-15',
    author: 'Sneaker Store'
  },
  {
    id: '6',
    title: 'Fake vs Original: Cómo Identificar Zapatillas Auténticas',
    slug: 'identificar-zapatillas-originales',
    excerpt: 'Aprende a distinguir las copias de los originales y evita comprar falsificaciones.',
    cover_image: '/blog-6.jpg',
    category: 'Guía',
    created_at: '2024-10-01',
    author: 'Sneaker Store'
  }
]

export default async function BlogPage() {
  const supabase = createClient()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
          <p className="text-gray-600">Noticias, guías y consejos sobre zapatillas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <a
                  href={`/blog/${post.slug}`}
                  className="text-black font-medium hover:underline"
                >
                  Leer más →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">¿Quieres recibir nuestras últimas guías y noticias?</p>
          <a
            href="/contacto"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Suscribirse al Newsletter
          </a>
        </div>
      </div>
    </div>
  )
}
