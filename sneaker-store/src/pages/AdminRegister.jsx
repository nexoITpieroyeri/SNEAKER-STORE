import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export function AdminRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (secretKey !== 'SNEAKER2024') {
      setError('Código secreto inválido')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'admin'
          })

        if (insertError) {
          console.error('Error inserting admin:', insertError)
        }
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/login')
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">¡Registro exitoso!</h2>
            <p className="text-muted-foreground mb-4">
              Tu cuenta de administrador ha sido creada.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirigiendo al login...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Registro de Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Nombre completo</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Código secreto</label>
              <Input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="SNEAKER2024"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Contacta al administrador para obtener el código
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/admin/login" className="text-primary hover:underline">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
