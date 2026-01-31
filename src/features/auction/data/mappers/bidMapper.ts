import type { Bid } from '@/features/auction/domain/entities'
import type { BidDocumentDTO } from '../dto'

export function mapBidDocumentDTOToEntity(dto: BidDocumentDTO): Bid {
  return {
    id: dto.$id,
    auctionId: dto.auction,
    productId: dto.product,
    userId: dto.userId,
    phoneNumber: dto.phoneNumber,
    amount: dto.amount,
    fallbackRank: dto.fallbackRank ?? 0,
    createdAt: dto.createdAt,
  }
}
