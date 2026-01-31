import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type { AuctionProduct } from '@/features/auction/domain/entities'
import type {
  AuctionProductRepository,
  CreateAuctionProductParams,
} from '@/features/auction/domain/repositories'
import { mapAuctionProductDocumentDTOToEntity } from '@/features/auction/data/mappers'
import { AuctionProductDocumentDTOSchema } from '@/features/auction/data/dto'
import { AppwriteAuctionProductDataSource } from '@/features/auction/data/datasources'

export class AuctionProductRepositoryImpl implements AuctionProductRepository {
  constructor(private readonly dataSource: AppwriteAuctionProductDataSource) {}

  async create(
    params: CreateAuctionProductParams
  ): Promise<Result<AuctionProduct, ValidationFailure | ServerFailure>> {
    try {
      const doc = await this.dataSource.createDocument({
        auction: params.auctionId,
        product: params.productId,
        sortOrder: params.sortOrder,
        minBidPrice: params.minBidPrice,
        selectedForLive: params.selectedForLive,
        price_increment_presets: params.price_increment_presets ?? [],
      })
      const parsed = AuctionProductDocumentDTOSchema.safeParse(doc)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(
            `Invalid auction product document ${doc.$id}: ${parsed.error.message}`
          )
        )
      }
      return Result.ok(mapAuctionProductDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create auction product'
      return Result.fail(new ServerFailure(message))
    }
  }

  async createMany(
    params: CreateAuctionProductParams[]
  ): Promise<Result<AuctionProduct[], ValidationFailure | ServerFailure>> {
    const results: AuctionProduct[] = []
    for (const p of params) {
      const result = await this.create(p)
      if (!result.success) return result
      results.push(result.data)
    }
    return Result.ok(results)
  }

  async listByAuctionId(
    auctionId: string
  ): Promise<Result<AuctionProduct[], ValidationFailure | ServerFailure>> {
    try {
      const response = await this.dataSource.listDocumentsByAuctionId(auctionId)
      const products: AuctionProduct[] = []
      for (const doc of response.documents) {
        const parsed = AuctionProductDocumentDTOSchema.safeParse(doc)
        if (!parsed.success) {
          return Result.fail(
            new ValidationFailure(
              `Invalid auction product document ${doc.$id}: ${parsed.error.message}`
            )
          )
        }
        products.push(mapAuctionProductDocumentDTOToEntity(parsed.data))
      }
      return Result.ok(products)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to list auction products'
      return Result.fail(new ServerFailure(message))
    }
  }
}
