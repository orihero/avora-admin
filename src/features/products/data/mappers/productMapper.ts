import type { Product } from '@/features/products/domain/entities'
import type { ProductDocumentDTO } from '../dto'

export function mapProductDocumentDTOToEntity(dto: ProductDocumentDTO): Product {
  return {
    id: dto.$id,
    name: dto.name,
    brand: dto.brand,
    price: dto.price,
    imageUrl: dto.imageUrl,
    backgroundColorHex: dto.backgroundColorHex ?? null,
    categoryId: dto.category ?? null,
    auctionRelated: dto.auctionRelated ?? false,
    createdAt: dto.$createdAt,
    updatedAt: dto.$updatedAt,
  }
}
