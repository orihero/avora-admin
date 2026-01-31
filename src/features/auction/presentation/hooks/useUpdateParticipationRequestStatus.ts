import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { PARTICIPATION_REQUEST_REPOSITORY_TOKEN } from '@/di/container'
import type { ParticipationRequestRepository } from '@/features/auction/domain/repositories'

async function updateStatusMutation({
  id,
  status,
  reviewedByProfileId,
}: {
  id: string
  status: 'approved' | 'declined'
  reviewedByProfileId: string
}) {
  const repo = container.resolve<ParticipationRequestRepository>(
    PARTICIPATION_REQUEST_REPOSITORY_TOKEN
  )
  const result = await repo.updateStatus(id, status, reviewedByProfileId)
  if (!result.success) throw new Error(result.error.message)
  return result.data
}

export function useUpdateParticipationRequestStatus(auctionId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStatusMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participation-requests', auctionId] })
    },
  })
}
