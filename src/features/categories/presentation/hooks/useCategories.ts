import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { CATEGORY_REPOSITORY_TOKEN } from '@/di/container'
import type { CategoryRepository } from '@/features/categories/domain/repositories'

export function useCategories() {
  const repo = container.resolve<CategoryRepository>(CATEGORY_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await repo.list()
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
  })
}
