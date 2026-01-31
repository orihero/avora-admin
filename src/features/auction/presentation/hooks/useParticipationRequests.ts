import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { PARTICIPATION_REQUEST_REPOSITORY_TOKEN } from '@/di/container'
import type {
  ParticipationRequestRepository,
  ListParticipationRequestsParams,
} from '@/features/auction/domain/repositories'

export interface UseParticipationRequestsParams extends ListParticipationRequestsParams {}

export function useParticipationRequests(
  auctionId: string | undefined,
  params?: UseParticipationRequestsParams
) {
  const repo = container.resolve<ParticipationRequestRepository>(
    PARTICIPATION_REQUEST_REPOSITORY_TOKEN
  )

  return useQuery({
    queryKey: ['participation-requests', auctionId, params],
    queryFn: async () => {
      if (!auctionId) throw new Error('auctionId required')
      const result = await repo.listByAuction(auctionId, params)
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
    enabled: !!auctionId,
  })
}
