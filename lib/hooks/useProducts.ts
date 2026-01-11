'use client'

import { createClient } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Product, ProductWithDetails } from '@/lib/supabase/types'

interface ProductsResponse {
  data: ProductWithDetails[]
  count: number
}

async function fetchProducts(params: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): Promise<ProductsResponse> {
  const supabase = createClient()
  const { page = 1, limit = 10, status, search } = params
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
    `, { count: 'exact' })

  if (status) {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  query = query.order('created_at', { ascending: false })
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw new Error(error.message)
  }

  return { 
    data: (data || []) as unknown as ProductWithDetails[], 
    count: count || 0 
  }
}

async function fetchProduct(id: string): Promise<ProductWithDetails> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brand:brands(*),
      images:product_images(*),
      sizes:product_sizes(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as unknown as ProductWithDetails
}

export function useProducts(params: { page?: number; limit?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Product['status'] }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
