import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (id: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (id) => set((state) => {
        const existing = state.items.find((item) => item.id === id)
        return {
          items: existing
            ? state.items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
            : [...state.items, { id, quantity: 1 }],
        }
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'fakestore-cart', storage: createJSONStorage(() => localStorage) },
  ),
)
