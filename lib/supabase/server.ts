import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: { path?: string; domain?: string; expires?: Date; maxAge?: number; sameSite?: 'strict' | 'lax' | 'none'; httpOnly?: boolean; secure?: boolean }) {
        try {
          cookieStore.set(name, value, options)
        } catch (error) {
          console.error('Error setting cookie:', error)
        }
      },
      remove(name: string, options: { path?: string; domain?: string; expires?: Date; maxAge?: number; sameSite?: 'strict' | 'lax' | 'none'; httpOnly?: boolean; secure?: boolean }) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        } catch (error) {
          console.error('Error removing cookie:', error)
        }
      },
    },
  })
}
