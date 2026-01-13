import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ShoppingBag, ArrowRight, Check, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 10) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }, [password])

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      })

      if (signUpError) throw signUpError

      if (data.user && data.user.identities?.length === 0) {
        throw new Error('Este email ya está registrado')
      }

      if (data.session) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500'
    if (passwordStrength <= 2) return 'bg-yellow-500'
    if (passwordStrength <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Débil'
    if (passwordStrength <= 2) return 'Regular'
    if (passwordStrength <= 3) return 'Buena'
    return 'Fuerte'
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">¡Registro exitoso!</h2>
            <p className="text-slate-600 mb-6">
              Tu cuenta ha sido creada correctamente. Bienvenido a Sneaker Store.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Redirigiendo...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDBMIDAgNDAgTCAwIEwgNDAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Sneaker Store</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Únete a la<br />
            <span className="text-white/80">comunidad</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Descubre las mejores zapatillas y mantente informado de los nuevos lanzamientos.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <UserPlus className="h-8 w-8 text-white/80 mb-2" />
              <p className="text-white/70 text-sm">Registro rápido</p>
              <p className="text-white font-semibold">En segundos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <ShoppingBag className="h-8 w-8 text-white/80 mb-2" />
              <p className="text-white/70 text-sm">Acceso exclusivo</p>
              <p className="text-white font-semibold">A preventas</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2026 Sneaker Store. Todos los derechos reservados.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Sneaker Store</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Crear cuenta</h2>
              <p className="text-slate-500">Únete a Sneaker Store</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStrengthColor()} transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength <= 1 ? 'text-red-500' : passwordStrength <= 2 ? 'text-yellow-500' : passwordStrength <= 3 ? 'text-blue-500' : 'text-green-500'}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs ${password.length >= 6 ? 'text-green-600' : 'text-slate-400'}`}>• Mínimo 6 caracteres</span>
                      <span className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>• Una mayúscula</span>
                      <span className={`text-xs ${/[0-9]/.test(password) ? 'text-green-600' : 'text-slate-400'}`}>• Un número</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  Acepto los{' '}
                  <Link to="/terminos" className="text-blue-600 hover:text-blue-700">términos de servicio</Link>
                  {' '}y{' '}
                  <Link to="/privacidad" className="text-blue-600 hover:text-blue-700">política de privacidad</Link>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Crear cuenta
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>

            <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeftIcon className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}
