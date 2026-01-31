import { Query } from 'appwrite'
import type { Models } from 'appwrite'
import {
  databases,
  AVORA_DATABASE_ID,
  VOTES_COLLECTION_ID,
} from '@/core/appwrite/client'
import type { VoteDocumentDTO } from '../dto'

export interface AppwriteVoteDocument extends Models.Document {
  auction: string
  product: string
  userId: string
  updatedAt: string
}

export interface AppwriteVotesListResponse {
  total: number
  documents: VoteDocumentDTO[]
}

export class AppwriteVotesDataSource {
  async listByAuctionId(auctionId: string): Promise<AppwriteVotesListResponse> {
    const response = await databases.listDocuments<AppwriteVoteDocument>(
      AVORA_DATABASE_ID,
      VOTES_COLLECTION_ID,
      [Query.equal('auction', auctionId)]
    )
    return {
      total: response.total,
      documents: (response.documents ?? []) as VoteDocumentDTO[],
    }
  }
}
