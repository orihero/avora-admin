import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { container } from '@/di/container'
import { LogoutUseCase } from '@/features/auth/domain/usecases'
import { useAuthStore } from '../stores'

async function logoutMutation() {
  const logoutUseCase = container.resolve(LogoutUseCase)
  const result = await logoutUseCase.execute()
  if (result.success) return
  throw new Error(result.error.message)
}

export function useLogout() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)
  return useMutation({
    mutationFn: logoutMutation,
    onSuccess: () => {
      clearAuth()
      navigate('/login', { replace: true })
    },
  })
}
