import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type { ParticipationRequest } from '@/features/auction/domain/entities'
import type {
  ParticipationRequestRepository,
  ListParticipationRequestsParams,
  ListParticipationRequestsResult,
} from '@/features/auction/domain/repositories'
import { mapParticipationRequestDocumentToEntity } from '@/features/auction/data/mappers'
import type { AppwriteParticipationRequestDataSource } from '@/features/auction/data/datasources'

export class ParticipationRequestRepositoryImpl implements ParticipationRequestRepository {
  constructor(
    private readonly dataSource: AppwriteParticipationRequestDataSource
  ) {}

  async listByAuction(
    auctionId: string,
    params?: ListParticipationRequestsParams
  ): Promise<Result<ListParticipationRequestsResult, ValidationFailure | ServerFailure>> {
    try {
      const response = await this.dataSource.listDocumentsByAuctionId(auctionId, params)
      const requests: ParticipationRequest[] = response.documents.map((doc) =>
        mapParticipationRequestDocumentToEntity(doc)
      )
      return Result.ok({ requests, total: response.total })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to list participation requests'
      return Result.fail(new ServerFailure(message))
    }
  }

  async updateStatus(
    id: string,
    status: 'approved' | 'declined',
    reviewedByProfileId: string
  ): Promise<Result<ParticipationRequest, ValidationFailure | ServerFailure>> {
    try {
      const reviewedAt = new Date().toISOString()
      const doc = await this.dataSource.updateDocument(id, {
        status,
        reviewedAt,
        reviewedBy: reviewedByProfileId,
      })
      return Result.ok(mapParticipationRequestDocumentToEntity(doc))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update participation request'
      return Result.fail(new ServerFailure(message))
    }
  }
}
