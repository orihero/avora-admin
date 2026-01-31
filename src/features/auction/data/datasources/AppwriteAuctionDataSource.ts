import { Query, ID } from 'appwrite'
import { databases, AVORA_DATABASE_ID, AUCTIONS_COLLECTION_ID } from '@/core/appwrite/client'
import type { ListAuctionsParams } from '@/features/auction/domain/repositories'

/** Payload for creating an auction document (Appwrite adds $id, $createdAt, $updatedAt). */
export interface CreateAuctionPayload {
  title: string
  description?: string | null
  startAt: string
  votingEndAt: string
  status: string
  progress: string
  pausedAt?: string | null
  extendedEndAt?: string | null
}

/** Raw document from Appwrite listDocuments (attributes as returned by API). */
export interface AppwriteAuctionDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
  title: string
  description?: string | null
  startAt: string
  votingEndAt: string
  status: string
  progress: string
  pausedAt?: string | null
  extendedEndAt?: string | null
}

export interface AppwriteAuctionListResponse {
  total: number
  documents: AppwriteAuctionDocument[]
}

export class AppwriteAuctionDataSource {
  async getDocument(id: string): Promise<AppwriteAuctionDocument | null> {
    try {
      const doc = await databases.getDocument<AppwriteAuctionDocument>(
        AVORA_DATABASE_ID,
        AUCTIONS_COLLECTION_ID,
        id
      )
      return doc as AppwriteAuctionDocument
    } catch (e: unknown) {
      const code = (e as { code?: number })?.code
      if (code === 404) return null
      throw e
    }
  }

  async listDocuments(params?: ListAuctionsParams): Promise<AppwriteAuctionListResponse> {
    const queries: string[] = []

    if (params?.status) {
      queries.push(Query.equal('status', params.status))
    }
    if (params?.progress) {
      queries.push(Query.equal('progress', params.progress))
    }
    if (params?.titleSearch?.trim()) {
      queries.push(Query.search('title', params.titleSearch.trim()))
    }

    const orderBy = params?.orderBy ?? 'startAt'
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

    const response = await databases.listDocuments<AppwriteAuctionDocument>(
      AVORA_DATABASE_ID,
      AUCTIONS_COLLECTION_ID,
      queries.length > 0 ? queries : undefined
    )

    return {
      total: response.total,
      documents: (response.documents ?? []) as AppwriteAuctionDocument[],
    }
  }

  async createDocument(data: CreateAuctionPayload): Promise<AppwriteAuctionDocument> {
    const doc = await databases.createDocument<AppwriteAuctionDocument>(
      AVORA_DATABASE_ID,
      AUCTIONS_COLLECTION_ID,
      ID.unique(),
      {
        title: data.title,
        description: data.description ?? null,
        startAt: data.startAt,
        votingEndAt: data.votingEndAt,
        status: data.status,
        progress: data.progress,
        pausedAt: data.pausedAt ?? null,
        extendedEndAt: data.extendedEndAt ?? null,
      }
    )
    return doc as AppwriteAuctionDocument
  }

  async updateDocument(id: string, data: CreateAuctionPayload): Promise<AppwriteAuctionDocument> {
    const doc = await databases.updateDocument<AppwriteAuctionDocument>(
      AVORA_DATABASE_ID,
      AUCTIONS_COLLECTION_ID,
      id,
      {
        title: data.title,
        description: data.description ?? null,
        startAt: data.startAt,
        votingEndAt: data.votingEndAt,
        status: data.status,
        progress: data.progress,
        pausedAt: data.pausedAt ?? null,
        extendedEndAt: data.extendedEndAt ?? null,
      }
    )
    return doc as AppwriteAuctionDocument
  }

  async deleteDocument(id: string): Promise<void> {
    await databases.deleteDocument(AVORA_DATABASE_ID, AUCTIONS_COLLECTION_ID, id)
  }
}
