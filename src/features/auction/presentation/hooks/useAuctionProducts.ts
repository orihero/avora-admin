import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_PRODUCT_REPOSITORY_TOKEN } from '@/di/container'
import type { AuctionProductRepository } from '@/features/auction/domain/repositories'

export function useAuctionProducts(auctionId: string | undefined) {
  const repo = container.resolve<AuctionProductRepository>(AUCTION_PRODUCT_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['auction-products', auctionId],
    queryFn: async () => {
      if (!auctionId) return []
      const result = await repo.listByAuctionId(auctionId)
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
    enabled: !!auctionId,
  })
}
