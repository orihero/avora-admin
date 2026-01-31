import { useMutation } from '@tanstack/react-query'
import { container } from '@/di/container'
import { LoginUseCase } from '@/features/auth/domain/usecases'
import type { LoginParams } from '@/features/auth/domain/repositories'

async function loginMutation(params: LoginParams) {
  const loginUseCase = container.resolve(LoginUseCase)
  const result = await loginUseCase.execute(params)
  if (result.success) return result.data
  const err = new Error(result.error.message) as Error & { code?: string }
  err.code = result.error.code
  throw err
}

export function useLogin() {
  return useMutation({ mutationFn: loginMutation })
}
