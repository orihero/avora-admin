import { ID } from 'appwrite'
import { databases, AVORA_DATABASE_ID, PRODUCTS_COLLECTION_ID } from '@/core/appwrite/client'

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

/** Raw document from Appwrite listDocuments (attributes as returned by API). */
export interface AppwriteProductDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
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
  async listDocuments(): Promise<AppwriteProductListResponse> {
    const response = await databases.listDocuments<AppwriteProductDocument>(
      AVORA_DATABASE_ID,
      PRODUCTS_COLLECTION_ID
    )
    return {
      total: response.total,
      documents: (response.documents ?? []) as AppwriteProductDocument[],
    }
  }

  async createDocument(data: CreateProductPayload): Promise<AppwriteProductDocument> {
    const doc = await databases.createDocument<AppwriteProductDocument>(
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
