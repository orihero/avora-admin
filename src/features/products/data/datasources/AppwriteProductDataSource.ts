import { ID, type Models } from 'appwrite'
import {
  databases,
  tablesDbListRows,
  AVORA_DATABASE_ID,
  PRODUCTS_COLLECTION_ID,
} from '@/core/appwrite/client'

/** Payload for creating a product document (Appwrite adds $id, $createdAt, $updatedAt). */
export interface CreateProductPayload {
  name: string
  brand: string
  price: number
  imageUrl: string
  backgroundColorHex?: string | null
  category?: string | null
  auctionRelated?: boolean
}

/** Raw document/row from Appwrite (attributes as returned by API). */
export interface AppwriteProductDocument {
  $id: string
  $collectionId?: string
  $databaseId?: string
  $createdAt: string
  $updatedAt: string
  $permissions?: string[]
  name: string
  brand: string
  price: number
  imageUrl: string
  backgroundColorHex?: string | null
  category?: string | null
  auctionRelated?: boolean
}

export interface AppwriteProductListResponse {
  total: number
  documents: AppwriteProductDocument[]
}

export class AppwriteProductDataSource {
  /**
   * Uses Tables DB API (/tablesdb/.../rows) because the database is type "tablesdb".
   * The Databases SDK (/databases/collections/documents) does not work with tablesdb databases.
   */
  async listDocuments(): Promise<AppwriteProductListResponse> {
    const response = await tablesDbListRows<AppwriteProductDocument>(
      AVORA_DATABASE_ID,
      PRODUCTS_COLLECTION_ID
    )
    return {
      total: response.total,
      documents: response.rows,
    }
  }

  async createDocument(data: CreateProductPayload): Promise<AppwriteProductDocument> {
    const doc = await databases.createDocument<Models.Document>(
      AVORA_DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        brand: data.brand,
        price: data.price,
        imageUrl: data.imageUrl,
        backgroundColorHex: data.backgroundColorHex ?? null,
        category: data.category ?? null,
        auctionRelated: data.auctionRelated ?? false,
      }
    )
    return doc as AppwriteProductDocument
  }
}
