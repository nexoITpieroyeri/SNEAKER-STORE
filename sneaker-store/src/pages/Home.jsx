import { useState, useEffect } from 'react'
import { Hero, FeaturedSection, BrandsSection, CTASection } from '../components/HomeSections'
import { supabase } from '../lib/supabase'

const mockBrands = [
  { id: 1, name: 'Nike', slug: 'nike' },
  { id: 2, name: 'Adidas', slug: 'adidas' },
  { id: 3, name: 'Jordan', slug: 'jordan' },
  { id: 4, name: 'Yeezy', slug: 'yeezy' },
  { id: 5, name: 'New Balance', slug: 'new_balance' },
  { id: 6, name: 'Puma', slug: 'puma' },
]

const mockProducts = [
  {
    id: 1,
    name: 'Nike Dunk Low "Panda"',
    slug: 'nike-dunk-low-panda',
    base_price: 2500,
    final_price: 2500,
    discount_percentage: 0,
    brand: { name: 'Nike', slug: 'nike' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500' }],
    sizes: [{ size: 'US 8' }, { size: 'US 9' }],
  },
  {
    id: 2,
    name: 'Air Jordan 1 High OG "Chicago"',
    slug: 'air-jordan-1-high-og-chicago',
    base_price: 3200,
    final_price: 2900,
    discount_percentage: 10,
    brand: { name: 'Jordan', slug: 'jordan' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' }],
    sizes: [{ size: 'US 8.5' }, { size: 'US 9' }],
  },
  {
    id: 3,
    name: 'Adidas Yeezy Boost 350 "Zebra"',
    slug: 'adidas-yeezy-boost-350-zebra',
    base_price: 4500,
    final_price: 4500,
    discount_percentage: 0,
    brand: { name: 'Yeezy', slug: 'yeezy' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500' }],
    sizes: [{ size: 'US 10' }],
  },
  {
    id: 4,
    name: 'New Balance 550 "White Green"',
    slug: 'new-balance-550-white-green',
    base_price: 2800,
    final_price: 2500,
    discount_percentage: 10,
    brand: { name: 'New Balance', slug: 'new_balance' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500' }],
    sizes: [{ size: 'US 7' }, { size: 'US 8' }],
  },
  {
    id: 5,
    name: 'Nike Air Max 90 "Infrared"',
    slug: 'nike-air-max-90-infrared',
    base_price: 2900,
    final_price: 2600,
    discount_percentage: 10,
    brand: { name: 'Nike', slug: 'nike' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' }],
    sizes: [{ size: 'US 9' }, { size: 'US 10' }],
  },
  {
    id: 6,
    name: 'Adidas Forum Low "White"',
    slug: 'adidas-forum-low-white',
    base_price: 2200,
    final_price: 2200,
    discount_percentage: 0,
    brand: { name: 'Adidas', slug: 'adidas' },
    images: [{ image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500' }],
    sizes: [{ size: 'US 8' }, { size: 'US 9' }, { size: 'US 11' }],
  },
]

export function HomePage() {
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setProducts(mockProducts)
      setFeaturedProducts(mockProducts.filter(p => p.discount_percentage > 0))
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen">
      <Hero />
      
      <FeaturedSection 
        title="🔥 Ofertas de la semana" 
        products={products.filter(p => p.discount_percentage > 0)} 
        link="/catalogo"
      />

      <BrandsSection brands={mockBrands} />

      <FeaturedSection 
        title="✨ Nuevos arrivals" 
        products={products} 
        link="/catalogo"
      />

      <CTASection />
    </div>
  )
}
