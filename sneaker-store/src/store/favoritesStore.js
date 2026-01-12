import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      addToFavorites: (product) => {
        const { favorites } = get()
        if (!favorites.find(f => f.id === product.id)) {
          set({ favorites: [...favorites, product] })
        }
      },
      removeFromFavorites: (productId) => {
        set({ favorites: get().favorites.filter(f => f.id !== productId) })
      },
      isFavorite: (productId) => {
        return get().favorites.some(f => f.id === productId)
      }
    }),
    {
      name: 'sneaker-favorites'
    }
  )
)
