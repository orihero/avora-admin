import { Query } from 'appwrite'
import type { Models } from 'appwrite'
import {
  databases,
  AVORA_DATABASE_ID,
  BIDS_COLLECTION_ID,
} from '@/core/appwrite/client'
import type { BidDocumentDTO } from '../dto'

export interface AppwriteBidDocument extends Models.Document {
  auction: string
  product: string
  userId: string
  phoneNumber: string
  amount: number
  fallbackRank?: number
  createdAt: string
}

export interface AppwriteBidsListResponse {
  total: number
  documents: BidDocumentDTO[]
}

export class AppwriteBidsDataSource {
  async listByAuctionId(auctionId: string): Promise<AppwriteBidsListResponse> {
    const response = await databases.listDocuments<AppwriteBidDocument>(
      AVORA_DATABASE_ID,
      BIDS_COLLECTION_ID,
      [Query.equal('auction', auctionId), Query.orderDesc('amount')]
    )
    return {
      total: response.total,
      documents: (response.documents ?? []) as BidDocumentDTO[],
    }
  }
}
