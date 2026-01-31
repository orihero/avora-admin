import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { AuctionProduct } from '../entities'

export interface CreateAuctionProductParams {
  auctionId: string
  productId: string
  sortOrder: number
  minBidPrice: number
  selectedForLive: boolean
  price_increment_presets?: string[]
}

export interface AuctionProductRepository {
  create(params: CreateAuctionProductParams): Promise<Result<AuctionProduct, Failure>>
  createMany(params: CreateAuctionProductParams[]): Promise<Result<AuctionProduct[], Failure>>
  listByAuctionId(auctionId: string): Promise<Result<AuctionProduct[], Failure>>
}
