import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AuthResponse, AuthUser } from '../api/auth'

interface AuthStore {
  token: string | null
  user: AuthUser | null
  setSession: (session: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: '319store-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
