/**
 * Vote domain entity (matches Appwrite votes table).
 */

export interface Vote {
  id: string
  auctionId: string
  productId: string
  userId: string
  updatedAt: string
  createdAt: string
}
