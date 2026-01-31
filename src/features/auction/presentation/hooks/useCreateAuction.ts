import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_REPOSITORY_TOKEN } from '@/di/container'
import type { AuctionRepository, CreateAuctionParams } from '@/features/auction/domain/repositories'

async function createAuctionMutation(params: CreateAuctionParams) {
  const repo = container.resolve<AuctionRepository>(AUCTION_REPOSITORY_TOKEN)
  const result = await repo.create(params)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export function useCreateAuction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAuctionMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
    },
  })
}
