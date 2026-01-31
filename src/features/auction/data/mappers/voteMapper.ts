import type { Vote } from '@/features/auction/domain/entities'
import type { VoteDocumentDTO } from '../dto'

export function mapVoteDocumentDTOToEntity(dto: VoteDocumentDTO): Vote {
  return {
    id: dto.$id,
    auctionId: dto.auction,
    productId: dto.product,
    userId: dto.userId,
    updatedAt: dto.updatedAt,
    createdAt: dto.$createdAt ?? dto.updatedAt,
  }
}
