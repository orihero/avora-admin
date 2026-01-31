import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type { Auction } from '@/features/auction/domain/entities'
import type {
  AuctionRepository,
  CreateAuctionParams,
  ListAuctionsParams,
  ListAuctionsResult,
  UpdateAuctionParams,
} from '@/features/auction/domain/repositories'
import { mapAuctionDocumentDTOToEntity } from '@/features/auction/data/mappers'
import { AuctionDocumentDTOSchema } from '@/features/auction/data/dto'
import { AppwriteAuctionDataSource } from '@/features/auction/data/datasources'

export class AuctionRepositoryImpl implements AuctionRepository {
  constructor(private readonly dataSource: AppwriteAuctionDataSource) {}

  async getById(id: string): Promise<Result<Auction | null, ValidationFailure | ServerFailure>> {
    try {
      const doc = await this.dataSource.getDocument(id)
      if (!doc) return Result.ok(null)
      const parsed = AuctionDocumentDTOSchema.safeParse(doc)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(`Invalid auction document ${doc.$id}: ${parsed.error.message}`)
        )
      }
      return Result.ok(mapAuctionDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to get auction'
      return Result.fail(new ServerFailure(message))
    }
  }

  async list(params?: ListAuctionsParams): Promise<Result<ListAuctionsResult, ValidationFailure | ServerFailure>> {
    try {
      const response = await this.dataSource.listDocuments(params)
      const auctions: ListAuctionsResult['auctions'] = []
      for (const doc of response.documents) {
        const parsed = AuctionDocumentDTOSchema.safeParse(doc)
        if (!parsed.success) {
          return Result.fail(
            new ValidationFailure(
              `Invalid auction document ${doc.$id}: ${parsed.error.message}`
            )
          )
        }
        auctions.push(mapAuctionDocumentDTOToEntity(parsed.data))
      }
      return Result.ok({ auctions, total: response.total })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to list auctions'
      return Result.fail(new ServerFailure(message))
    }
  }

  async create(params: CreateAuctionParams): Promise<Result<Auction, ValidationFailure | ServerFailure>> {
    try {
      const doc = await this.dataSource.createDocument({
        title: params.title,
        description: params.description,
        startAt: params.startAt,
        votingEndAt: params.votingEndAt,
        status: params.status,
        progress: params.progress,
        pausedAt: null,
        extendedEndAt: null,
      })
      const parsed = AuctionDocumentDTOSchema.safeParse(doc)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(`Invalid auction document ${doc.$id}: ${parsed.error.message}`)
        )
      }
      return Result.ok(mapAuctionDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create auction'
      return Result.fail(new ServerFailure(message))
    }
  }

  async update(
    id: string,
    params: UpdateAuctionParams
  ): Promise<Result<Auction, ValidationFailure | ServerFailure>> {
    try {
      const doc = await this.dataSource.updateDocument(id, {
        title: params.title,
        description: params.description,
        startAt: params.startAt,
        votingEndAt: params.votingEndAt,
        status: params.status,
        progress: params.progress,
        pausedAt: null,
        extendedEndAt: null,
      })
      const parsed = AuctionDocumentDTOSchema.safeParse(doc)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(`Invalid auction document ${doc.$id}: ${parsed.error.message}`)
        )
      }
      return Result.ok(mapAuctionDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update auction'
      return Result.fail(new ServerFailure(message))
    }
  }

  async delete(id: string): Promise<Result<void, ValidationFailure | ServerFailure>> {
    try {
      await this.dataSource.deleteDocument(id)
      return Result.ok(undefined)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete auction'
      return Result.fail(new ServerFailure(message))
    }
  }
}
