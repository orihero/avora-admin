/**
 * AuctionProduct domain entity (matches Appwrite auction_products table + system attributes).
 */

export interface AuctionProduct {
  id: string
  auctionId: string
  productId: string
  sortOrder: number
  minBidPrice: number
  selectedForLive: boolean
  categoryCancelled: boolean | null
  price_increment_presets: string[]
  createdAt: string
  updatedAt: string
}
