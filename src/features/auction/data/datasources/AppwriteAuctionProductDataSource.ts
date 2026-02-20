import { ID, Query, type Models } from 'appwrite'
import {
  databases,
  tablesDbListRows,
  AVORA_DATABASE_ID,
  AUCTION_PRODUCTS_COLLECTION_ID,
} from '@/core/appwrite/client'

/** Payload for creating an auction_product document (Appwrite adds $id, $createdAt, $updatedAt). */
export interface CreateAuctionProductPayload {
  auction: string
  product: string
  sortOrder: number
  minBidPrice: number
  selectedForLive: boolean
  price_increment_presets?: string[]
}

/** Raw document/row from Appwrite (attributes as returned by API). */
export interface AppwriteAuctionProductDocument {
  $id: string
  $collectionId?: string
  $databaseId?: string
  $createdAt: string
  $updatedAt: string
  $permissions?: string[]
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
  /**
   * Uses Tables DB API (/tablesdb/.../rows) because the database is type "tablesdb".
   * The Databases SDK (/databases/collections/documents) does not work with tablesdb databases.
   */
  async listDocumentsByAuctionId(auctionId: string): Promise<AppwriteAuctionProductListResponse> {
    const response = await tablesDbListRows<AppwriteAuctionProductDocument>(
      AVORA_DATABASE_ID,
      AUCTION_PRODUCTS_COLLECTION_ID,
      [Query.equal('auction', auctionId), Query.orderAsc('sortOrder')]
    )
    return {
      total: response.total,
      documents: response.rows,
    }
  }

  async createDocument(data: CreateAuctionProductPayload): Promise<AppwriteAuctionProductDocument> {
    const doc = await databases.createDocument<Models.Document>(
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
