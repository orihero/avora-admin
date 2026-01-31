import { ID, Query } from 'appwrite'
import { databases, AVORA_DATABASE_ID, AUCTION_PRODUCTS_COLLECTION_ID } from '@/core/appwrite/client'

/** Payload for creating an auction_product document (Appwrite adds $id, $createdAt, $updatedAt). */
export interface CreateAuctionProductPayload {
  auction: string
  product: string
  sortOrder: number
  minBidPrice: number
  selectedForLive: boolean
  price_increment_presets?: string[]
}

/** Raw document from Appwrite createDocument (attributes as returned by API). */
export interface AppwriteAuctionProductDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
  auction: string
  product: string
  sortOrder: number
  minBidPrice: number
  selectedForLive: boolean
  price_increment_presets?: string[]
}

export interface AppwriteAuctionProductListResponse {
  total: number
  documents: AppwriteAuctionProductDocument[]
}

export class AppwriteAuctionProductDataSource {
  async listDocumentsByAuctionId(auctionId: string): Promise<AppwriteAuctionProductListResponse> {
    const response = await databases.listDocuments<AppwriteAuctionProductDocument>(
      AVORA_DATABASE_ID,
      AUCTION_PRODUCTS_COLLECTION_ID,
      [Query.equal('auction', auctionId), Query.orderAsc('sortOrder')]
    )
    return {
      total: response.total,
      documents: (response.documents ?? []) as AppwriteAuctionProductDocument[],
    }
  }

  async createDocument(data: CreateAuctionProductPayload): Promise<AppwriteAuctionProductDocument> {
    const doc = await databases.createDocument<AppwriteAuctionProductDocument>(
      AVORA_DATABASE_ID,
      AUCTION_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        auction: data.auction,
        product: data.product,
        sortOrder: data.sortOrder,
        minBidPrice: data.minBidPrice,
        selectedForLive: data.selectedForLive,
        price_increment_presets: data.price_increment_presets ?? [],
      }
    )
    return doc as AppwriteAuctionProductDocument
  }
}
