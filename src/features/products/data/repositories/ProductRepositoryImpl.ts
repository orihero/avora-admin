import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type {
  ProductRepository,
  ListProductsResult,
  CreateProductParams,
} from '@/features/products/domain/repositories'
import type { Product } from '@/features/products/domain/entities'
import { mapProductDocumentDTOToEntity } from '@/features/products/data/mappers'
import { ProductDocumentDTOSchema } from '@/features/products/data/dto'
import { AppwriteProductDataSource } from '@/features/products/data/datasources'

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly dataSource: AppwriteProductDataSource) {}

  async create(
    params: CreateProductParams
  ): Promise<Result<Product, ValidationFailure | ServerFailure>> {
    try {
      const doc = await this.dataSource.createDocument({
        name: params.name,
        brand: params.brand,
        price: params.price,
        imageUrl: params.imageUrl,
        backgroundColorHex: params.backgroundColorHex ?? null,
        category: params.category ?? null,
        auctionRelated: params.auctionRelated ?? false,
      })
      const parsed = ProductDocumentDTOSchema.safeParse(doc)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(`Invalid product document ${doc.$id}: ${parsed.error.message}`)
        )
      }
      return Result.ok(mapProductDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create product'
      return Result.fail(new ServerFailure(message))
    }
  }

  async list(): Promise<Result<ListProductsResult, ValidationFailure | ServerFailure>> {
    try {
      const response = await this.dataSource.listDocuments()
      const products: ListProductsResult['products'] = []
      for (const doc of response.documents) {
        const parsed = ProductDocumentDTOSchema.safeParse(doc)
        if (!parsed.success) {
          return Result.fail(
            new ValidationFailure(`Invalid product document ${doc.$id}: ${parsed.error.message}`)
          )
        }
        products.push(mapProductDocumentDTOToEntity(parsed.data))
      }
      return Result.ok({ products, total: response.total })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to list products'
      return Result.fail(new ServerFailure(message))
    }
  }
}
