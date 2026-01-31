import { create } from 'zustand'
import type { AuthToken, UserProfile } from '@/features/auth/domain/entities'

interface AuthState {
  token: AuthToken | null
  profile: UserProfile | null
  sessionChecked: boolean
  setAuth: (token: AuthToken, profile: UserProfile | null) => void
  setSessionChecked: (value: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  profile: null,
  sessionChecked: false,
  setAuth: (token, profile) => set({ token, profile }),
  setSessionChecked: (value) => set({ sessionChecked: value }),
  clearAuth: () => set({ token: null, profile: null }),
}))
