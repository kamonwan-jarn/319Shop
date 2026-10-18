import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (id: number | string) => void
  removeItem: (id: number | string) => void
  updateQuantity: (id: number | string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (id) =>
        set((state) => {
          const targetId = Number(id)
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
        }),

      removeItem: (id) =>
        set((state) => {
          const targetId = Number(id)
          return {
            items: state.items.filter((item) => Number(item.id) !== targetId),
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const targetId = Number(id)
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
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)