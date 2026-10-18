import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface WishlistStore {
  wishlistIds: number[]
  toggleWishlist: (id: number | string) => void
  isInWishlist: (id: number | string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (id) => {
        const numId = Number(id)
        set((state) => {
          const exists = state.wishlistIds.includes(numId)
          if (exists) {
            return { wishlistIds: state.wishlistIds.filter((item) => item !== numId) }
          }
          return { wishlistIds: [...state.wishlistIds, numId] }
        })
      },
      isInWishlist: (id) => get().wishlistIds.includes(Number(id)),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)