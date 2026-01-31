/**
 * Bid domain entity (matches Appwrite bids table).
 */

export interface Bid {
  id: string
  auctionId: string
  productId: string
  userId: string
  phoneNumber: string
  amount: number
  fallbackRank: number
  createdAt: string
}
