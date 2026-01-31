import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { ParticipationRequest, ParticipationRequestStatus } from '../entities'

export interface ListParticipationRequestsParams {
  limit?: number
  offset?: number
  status?: ParticipationRequestStatus
  orderBy?: string
  orderDesc?: boolean
}

export interface ListParticipationRequestsResult {
  requests: ParticipationRequest[]
  total: number
}

export interface ParticipationRequestRepository {
  listByAuction(
    auctionId: string,
    params?: ListParticipationRequestsParams
  ): Promise<Result<ListParticipationRequestsResult, Failure>>
  updateStatus(
    id: string,
    status: 'approved' | 'declined',
    reviewedByProfileId: string
  ): Promise<Result<ParticipationRequest, Failure>>
}
