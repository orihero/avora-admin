import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { AUCTION_REPOSITORY_TOKEN } from '@/di/container'
import type {
  AuctionRepository,
  UpdateAuctionParams,
} from '@/features/auction/domain/repositories'

async function updateAuctionMutation({
  id,
  params,
}: {
  id: string
  params: UpdateAuctionParams
}) {
  const repo = container.resolve<AuctionRepository>(AUCTION_REPOSITORY_TOKEN)
  const result = await repo.update(id, params)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export function useUpdateAuction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAuctionMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] })
    },
  })
}
