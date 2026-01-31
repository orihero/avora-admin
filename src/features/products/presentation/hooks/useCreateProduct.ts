import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { PRODUCT_REPOSITORY_TOKEN } from '@/di/container'
import type {
  ProductRepository,
  CreateProductParams,
} from '@/features/products/domain/repositories'

async function createProductMutation(params: CreateProductParams) {
  const repo = container.resolve<ProductRepository>(PRODUCT_REPOSITORY_TOKEN)
  const result = await repo.create(params)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProductMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
