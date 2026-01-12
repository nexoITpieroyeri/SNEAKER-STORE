import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/Home'
import { CatalogPage } from './pages/Catalog'
import { ProductDetailPage } from './pages/ProductDetail'
import { FavoritesPage } from './pages/Favorites'
import { AdminLogin } from './pages/AdminLogin'
import { AdminRegister } from './pages/AdminRegister'
import { AdminDashboard } from './pages/AdminDashboard'
import { LoginPage } from './pages/Login'
import { RegisterPage } from './pages/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
