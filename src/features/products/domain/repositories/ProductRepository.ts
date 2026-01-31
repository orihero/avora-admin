import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { Product } from '../entities'

export interface ListProductsResult {
  products: Product[]
  total: number
}

export interface CreateProductParams {
  name: string
  brand: string
  price: number
  imageUrl: string
  backgroundColorHex?: string | null
  category?: string | null
  auctionRelated?: boolean
}

export interface ProductRepository {
  list(): Promise<Result<ListProductsResult, Failure>>
  create(params: CreateProductParams): Promise<Result<Product, Failure>>
}
