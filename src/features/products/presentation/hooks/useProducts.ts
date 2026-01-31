import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { PRODUCT_REPOSITORY_TOKEN } from '@/di/container'
import type { ProductRepository } from '@/features/products/domain/repositories'

export function useProducts() {
  const repo = container.resolve<ProductRepository>(PRODUCT_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await repo.list()
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
  })
}
