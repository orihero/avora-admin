import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_REPOSITORY_TOKEN } from '@/di/container'
import type { AuctionRepository } from '@/features/auction/domain/repositories'

async function deleteAuctionMutation(id: string) {
  const repo = container.resolve<AuctionRepository>(AUCTION_REPOSITORY_TOKEN)
  const result = await repo.delete(id)
  if (!result.success) throw new Error(result.error.message)
}

export function useDeleteAuction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAuctionMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
    },
  })
}
