/**
 * Product domain entity (matches Appwrite products table + system attributes).
 */

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string
  backgroundColorHex: string | null
  categoryId: string | null
  auctionRelated: boolean
  createdAt: string
  updatedAt: string
}
