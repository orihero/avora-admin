import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_STATS_REPOSITORY_TOKEN } from '@/di/container'
import type { AuctionStatsRepository } from '@/features/auction/domain/repositories'

export function useAuctionStats(auctionId: string | undefined) {
  const repo = container.resolve<AuctionStatsRepository>(AUCTION_STATS_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['auction-stats', auctionId],
    queryFn: async () => {
      if (!auctionId) return null
      const result = await repo.getAuctionStats(auctionId)
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
    enabled: !!auctionId,
  })
}
