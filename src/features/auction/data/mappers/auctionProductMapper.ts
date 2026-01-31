import type { AuctionProduct } from '@/features/auction/domain/entities'
import type { AuctionProductDocumentDTO } from '../dto'

export function mapAuctionProductDocumentDTOToEntity(
  dto: AuctionProductDocumentDTO
): AuctionProduct {
  return {
    id: dto.$id,
    auctionId: dto.auction,
    productId: dto.product,
    sortOrder: dto.sortOrder,
    minBidPrice: dto.minBidPrice,
    selectedForLive: dto.selectedForLive,
    categoryCancelled: null,
    price_increment_presets: dto.price_increment_presets ?? [],
    createdAt: dto.$createdAt,
    updatedAt: dto.$updatedAt,
  }
}
