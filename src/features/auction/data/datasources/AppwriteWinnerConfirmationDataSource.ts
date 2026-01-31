import { Query } from 'appwrite'
import type { Models } from 'appwrite'
import {
  databases,
  AVORA_DATABASE_ID,
  WINNER_CONFIRMATION_COLLECTION_ID,
} from '@/core/appwrite/client'
import type { WinnerConfirmationDocumentDTO } from '../dto'

export interface AppwriteWinnerConfirmationDocument extends Models.Document {
  auction: string
  product: string
  userId: string
  status: WinnerConfirmationDocumentDTO['status']
  confirmedAt: string | null
  fallbackRank: number
}

export interface AppwriteWinnerConfirmationListResponse {
  total: number
  documents: WinnerConfirmationDocumentDTO[]
}

export class AppwriteWinnerConfirmationDataSource {
  async listByAuctionId(
    auctionId: string
  ): Promise<AppwriteWinnerConfirmationListResponse> {
    const response =
      await databases.listDocuments<AppwriteWinnerConfirmationDocument>(
        AVORA_DATABASE_ID,
        WINNER_CONFIRMATION_COLLECTION_ID,
        [Query.equal('auction', auctionId)]
      )
    return {
      total: response.total,
      documents: (response.documents ?? []) as WinnerConfirmationDocumentDTO[],
    }
  }
}
