import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_REPOSITORY_TOKEN } from '@/di/container'
import type { AuctionRepository, ListAuctionsParams } from '@/features/auction/domain/repositories'

export interface UseAuctionsParams extends ListAuctionsParams {}

export function useAuctions(params?: UseAuctionsParams) {
  const repo = container.resolve<AuctionRepository>(AUCTION_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['auctions', params],
    queryFn: async () => {
      const result = await repo.list(params)
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
  })
}
