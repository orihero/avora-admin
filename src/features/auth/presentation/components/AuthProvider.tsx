import { useEffect } from 'react'
import { container } from '@/di/container'
import { GetCurrentSessionUseCase, LogoutUseCase } from '@/features/auth/domain/usecases'
import { useAuthStore } from '../stores'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setAuth = useAuthStore((s) => s.setAuth)
  const setSessionChecked = useAuthStore((s) => s.setSessionChecked)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  useEffect(() => {
    const getSessionUseCase = container.resolve(GetCurrentSessionUseCase)
    getSessionUseCase
      .execute()
      .then(async (result) => {
        if (result.success && result.data !== null) {
          const profile = result.data.profile
          const isAdmin = profile?.role === 'admin'
          if (!profile || !isAdmin) {
            const logoutUseCase = container.resolve(LogoutUseCase)
            await logoutUseCase.execute()
            clearAuth()
          } else {
            setAuth(result.data!.token, result.data!.profile)
          }
        }
        setSessionChecked(true)
      })
      .catch(() => {
        setSessionChecked(true)
      })
  }, [setAuth, setSessionChecked, clearAuth])

  return <>{children}</>
}
