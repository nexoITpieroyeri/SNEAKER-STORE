import { useState, useEffect } from 'react'
import { Hero, FeaturedSection, BrandsSection, CTASection } from '../components/HomeSections'
import { supabase } from '../lib/supabase'

export function HomePage() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [productsResult, brandsResult] = await Promise.all([
          supabase
            .from('products')
            .select(`
              *,
              brand:brands(name, slug),
              product_images(url, alt_text, sort_order, is_primary),
              product_sizes(size, stock_quantity)
            `)
            .eq('status', 'published')
            .order('created_at', { ascending: false }),
          supabase
            .from('brands')
            .select('id, name, slug, logo_url')
            .eq('is_active', true)
            .order('name')
        ])

        if (productsResult.data) {
          const formattedProducts = productsResult.data.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            base_price: p.base_price,
            final_price: p.final_price || p.base_price,
            discount_percentage: p.discount_percentage,
            brand: p.brand,
            images: p.product_images?.sort((a, b) => a.sort_order - b.sort_order).map(img => ({
              image_url: img.url
            })) || [],
            sizes: p.product_sizes?.map(s => ({
              size: s.size,
              stock_quantity: s.stock_quantity,
              is_available: s.stock_quantity > 0
            })) || [],
            has_stock: p.product_sizes?.some(s => s.stock_quantity > 0) || false
          }))
          setProducts(formattedProducts)
        }

        setBrands(brandsResult.data || [])
      } catch (err) {
        console.error('Error fetching data:', err)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const featuredProducts = products.filter(p => p.discount_percentage > 0)
  const newArrivals = products.slice(0, 8)

  return (
    <div className="min-h-screen">
      <Hero />
      
      <FeaturedSection 
        title="🔥 Ofertas de la semana" 
        products={featuredProducts} 
        link="/catalogo"
        loading={loading}
      />

      <BrandsSection brands={brands} loading={loading} />

      <FeaturedSection 
        title="✨ Nuevos arrivals" 
        products={newArrivals} 
        link="/catalogo"
        loading={loading}
      />

      <CTASection />
    </div>
  )
}
