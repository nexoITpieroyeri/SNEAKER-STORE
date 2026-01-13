import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/Home'
import { CatalogPage } from './pages/Catalog'
import { ProductDetailPage } from './pages/ProductDetail'
import { FavoritesPage } from './pages/Favorites'
import { MyOrdersPage } from './pages/MyOrders'
import { TermsPage } from './pages/Terms'
import { PrivacyPage } from './pages/Privacy'
import { AdminDashboard } from './pages/AdminDashboard'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="*" element={
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalogo" element={<CatalogPage />} />
                <Route path="/catalogo/:brand" element={<CatalogPage />} />
                <Route path="/producto/:slug" element={<ProductDetailPage />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="/mis-pedidos" element={<MyOrdersPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
