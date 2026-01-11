export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          brand_id: string
          name: string
          slug: string
          description: string | null
          base_price: number
          discount_percentage: number | null
          final_price: number
          gender: 'men' | 'women' | 'unisex' | 'kids'
          category: 'running' | 'basketball' | 'casual' | 'lifestyle' | 'limited_edition'
          condition: 'new_with_box' | 'new_without_box' | 'preowned'
          status: 'draft' | 'published' | 'sold_out' | 'archived'
          featured: boolean
          sku: string | null
          meta_title: string | null
          meta_description: string | null
          view_count: number
          whatsapp_clicks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          name: string
          slug: string
          description?: string | null
          base_price: number
          discount_percentage?: number | null
          final_price: number
          gender: 'men' | 'women' | 'unisex' | 'kids'
          category: 'running' | 'basketball' | 'casual' | 'lifestyle' | 'limited_edition'
          condition: 'new_with_box' | 'new_without_box' | 'preowned'
          status?: 'draft' | 'published' | 'sold_out' | 'archived'
          featured?: boolean
          sku?: string | null
          meta_title?: string | null
          meta_description?: string | null
          view_count?: number
          whatsapp_clicks?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          name?: string
          slug?: string
          description?: string | null
          base_price?: number
          discount_percentage?: number | null
          final_price?: number
          gender?: 'men' | 'women' | 'unisex' | 'kids'
          category?: 'running' | 'basketball' | 'casual' | 'lifestyle' | 'limited_edition'
          condition?: 'new_with_box' | 'new_without_box' | 'preowned'
          status?: 'draft' | 'published' | 'sold_out' | 'archived'
          featured?: boolean
          sku?: string | null
          meta_title?: string | null
          meta_description?: string | null
          view_count?: number
          whatsapp_clicks?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          display_order: number
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          display_order?: number
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          display_order?: number
          alt_text?: string | null
          created_at?: string
        }
      }
      product_sizes: {
        Row: {
          id: string
          product_id: string
          size: string
          stock_quantity: number
          is_available: boolean
        }
        Insert: {
          id?: string
          product_id: string
          size: string
          stock_quantity?: number
          is_available?: boolean
        }
        Update: {
          id?: string
          product_id?: string
          size?: string
          stock_quantity?: number
          is_available?: boolean
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'super_admin' | 'admin' | 'editor'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'editor'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'super_admin' | 'admin' | 'editor'
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_type: string
          product_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          product_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          product_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      product_views: {
        Row: {
          id: string
          product_id: string
          viewed_at: string
          user_ip: string | null
        }
        Insert: {
          id?: string
          product_id: string
          viewed_at?: string
          user_ip?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          viewed_at?: string
          user_ip?: string | null
        }
      }
    }
  }
}

export type Brand = Database['public']['Tables']['brands']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductSize = Database['public']['Tables']['product_sizes']['Row']

export interface ProductWithDetails extends Product {
  brand: Brand
  images: ProductImage[]
  sizes: ProductSize[]
}
