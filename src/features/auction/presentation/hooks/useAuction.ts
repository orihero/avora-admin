import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_REPOSITORY_TOKEN } from '@/di/container'
import type { AuctionRepository } from '@/features/auction/domain/repositories'

export function useAuction(id: string | undefined) {
  const repo = container.resolve<AuctionRepository>(AUCTION_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['auction', id],
    queryFn: async () => {
      if (!id) return null
      const result = await repo.getById(id)
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
    enabled: !!id,
  })
}
