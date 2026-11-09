import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { clearSavedCart, removeSavedCartItem, saveCartItem, updateSavedCartQuantity } from '../api/cart'
import { useAuthStore } from './useAuthStore'
import type { Product } from '../types/product'

export interface CartItem {
  id: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (id: number | string, product?: Product) => void
  removeItem: (id: number | string) => void
  updateQuantity: (id: number | string, quantity: number) => void
  clearCart: () => void
  clearLocalCart: () => void
  replaceItems: (items: CartItem[]) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (id, product) => {
        const targetId = Number(id)
        set((state) => {
          const existingItem = state.items.find((item) => Number(item.id) === targetId)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                Number(item.id) === targetId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, { id: targetId, quantity: 1 }] }
        })

        const token = useAuthStore.getState().token
        const quantity = get().items.find((item) => item.id === targetId)?.quantity
        if (token && product && quantity) {
          void saveCartItem(token, product, quantity).catch((error: unknown) => {
            console.warn('Could not save cart item to the account:', error)
          })
        }
      },

      removeItem: (id) => {
        const targetId = Number(id)
        set((state) => {
          return {
            items: state.items.filter((item) => Number(item.id) !== targetId),
          }
        })

        const token = useAuthStore.getState().token
        if (token) {
          void removeSavedCartItem(token, targetId).catch((error: unknown) => {
            console.warn('Could not remove the account cart item:', error)
          })
        }
      },

      updateQuantity: (id, quantity) => {
        const targetId = Number(id)
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => Number(item.id) !== targetId),
            }
          }
          return {
            items: state.items.map((item) =>
              Number(item.id) === targetId ? { ...item, quantity } : item
            ),
          }
        })

        const token = useAuthStore.getState().token
        if (token) {
          const saveRequest = quantity <= 0
            ? removeSavedCartItem(token, targetId)
            : updateSavedCartQuantity(token, targetId, quantity)
          void saveRequest.catch((error: unknown) => {
            console.warn('Could not update the account cart item:', error)
          })
        }
      },

      clearCart: () => {
        set({ items: [] })
        const token = useAuthStore.getState().token
        if (token) {
          void clearSavedCart(token).catch((error: unknown) => {
            console.warn('Could not clear the account cart:', error)
          })
        }
      },
      clearLocalCart: () => set({ items: [] }),
      replaceItems: (items) => set({ items }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)