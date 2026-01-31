import { Query } from 'appwrite'
import {
  databases,
  AVORA_DATABASE_ID,
  PARTICIPATION_REQUESTS_COLLECTION_ID,
} from '@/core/appwrite/client'
import type {
  ListParticipationRequestsParams,
} from '@/features/auction/domain/repositories'
import type { AppwriteParticipationRequestDocument } from '../dto/participationRequestDto'

export interface AppwriteParticipationRequestListResponse {
  total: number
  documents: AppwriteParticipationRequestDocument[]
}

export class AppwriteParticipationRequestDataSource {
  async listDocumentsByAuctionId(
    auctionId: string,
    params?: ListParticipationRequestsParams
  ): Promise<AppwriteParticipationRequestListResponse> {
    const queries: string[] = [Query.equal('auction', auctionId)]

    if (params?.status) {
      queries.push(Query.equal('status', params.status))
    }

    const orderBy = params?.orderBy ?? '$createdAt'
    if (params?.orderDesc) {
      queries.push(Query.orderDesc(orderBy))
    } else {
      queries.push(Query.orderAsc(orderBy))
    }
    if (params?.limit != null) {
      queries.push(Query.limit(params.limit))
    }
    if (params?.offset != null) {
      queries.push(Query.offset(params.offset))
    }

    // Expand user relation for display name
    queries.push(Query.select(['*', 'user.$id', 'user.firstName', 'user.lastName']))

    const response = await databases.listDocuments<AppwriteParticipationRequestDocument>(
      AVORA_DATABASE_ID,
      PARTICIPATION_REQUESTS_COLLECTION_ID,
      queries
    )

    return {
      total: response.total,
      documents: (response.documents ?? []) as AppwriteParticipationRequestDocument[],
    }
  }

  async updateDocument(
    id: string,
    data: {
      status: 'approved' | 'declined'
      reviewedAt: string
      reviewedBy?: string
    }
  ): Promise<AppwriteParticipationRequestDocument> {
    const payload: Record<string, unknown> = {
      status: data.status,
      reviewedAt: data.reviewedAt,
    }
    if (data.reviewedBy != null) {
      payload.reviewedBy = data.reviewedBy
    }

    const doc = await databases.updateDocument<AppwriteParticipationRequestDocument>(
      AVORA_DATABASE_ID,
      PARTICIPATION_REQUESTS_COLLECTION_ID,
      id,
      payload as Record<string, string>
    )
    return doc as AppwriteParticipationRequestDocument
  }
}
