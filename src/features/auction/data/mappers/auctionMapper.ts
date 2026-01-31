import type { Auction } from '@/features/auction/domain/entities'
import type { AuctionDocumentDTO } from '../dto'

export function mapAuctionDocumentDTOToEntity(dto: AuctionDocumentDTO): Auction {
  return {
    id: dto.$id,
    title: dto.title,
    description: dto.description ?? null,
    startAt: dto.startAt,
    votingEndAt: dto.votingEndAt,
    status: dto.status,
    progress: dto.progress,
    pausedAt: dto.pausedAt ?? null,
    extendedEndAt: dto.extendedEndAt ?? null,
    createdAt: dto.$createdAt,
    updatedAt: dto.$updatedAt,
  }
}
