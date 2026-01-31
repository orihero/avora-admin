import type { WinnerConfirmation } from '@/features/auction/domain/entities'
import type { WinnerConfirmationDocumentDTO } from '../dto'

export function mapWinnerConfirmationDocumentDTOToEntity(
  dto: WinnerConfirmationDocumentDTO
): WinnerConfirmation {
  return {
    id: dto.$id,
    auctionId: dto.auction,
    productId: dto.product,
    userId: dto.userId,
    status: dto.status,
    confirmedAt: dto.confirmedAt ?? null,
    fallbackRank: dto.fallbackRank,
    createdAt: dto.$createdAt ?? '',
    updatedAt: dto.$updatedAt ?? '',
  }
}
