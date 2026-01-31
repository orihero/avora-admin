import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { VARIABLES_REPOSITORY_TOKEN } from '@/di/container'
import type { VariablesRepository } from '@/features/settings/domain/repositories'

export function useVariables() {
  const repo = container.resolve<VariablesRepository>(VARIABLES_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['variables'],
    queryFn: async () => {
      const result = await repo.list()
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
  })
}
