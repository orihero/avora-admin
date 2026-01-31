import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type { WinnerConfirmation } from '@/features/auction/domain/entities'
import type {
  AuctionStats,
  AuctionStatsRepository,
  BidsByProduct,
  ParticipationCounts,
} from '@/features/auction/domain/repositories'
import { mapBidDocumentDTOToEntity } from '@/features/auction/data/mappers'
import { mapWinnerConfirmationDocumentDTOToEntity } from '@/features/auction/data/mappers'
import { BidDocumentDTOSchema } from '@/features/auction/data/dto'
import { VoteDocumentDTOSchema } from '@/features/auction/data/dto'
import { WinnerConfirmationDocumentDTOSchema } from '@/features/auction/data/dto'
import type {
  AppwriteVotesDataSource,
  AppwriteParticipationRequestDataSource,
  AppwriteBidsDataSource,
  AppwriteWinnerConfirmationDataSource,
} from '@/features/auction/data/datasources'

interface RawParticipationDoc {
  auction: string
  product?: string | null
  status: 'pending' | 'approved' | 'declined'
}

export class AuctionStatsRepositoryImpl implements AuctionStatsRepository {
  constructor(
    private readonly votesDataSource: AppwriteVotesDataSource,
    private readonly participationDataSource: AppwriteParticipationRequestDataSource,
    private readonly bidsDataSource: AppwriteBidsDataSource,
    private readonly winnerConfirmationDataSource: AppwriteWinnerConfirmationDataSource
  ) {}

  async getAuctionStats(auctionId: string): Promise<
    Result<AuctionStats, ValidationFailure | ServerFailure>
  > {
    try {
      const [votesRes, participationRes, bidsRes, winnerConfirmationRes] =
        await Promise.all([
          this.votesDataSource.listByAuctionId(auctionId),
          this.participationDataSource.listDocumentsByAuctionId(auctionId),
          this.bidsDataSource.listByAuctionId(auctionId),
          this.winnerConfirmationDataSource.listByAuctionId(auctionId),
        ])

      const voteCountsByProduct: Record<string, number> = {}
      const voterIds = new Set<string>()

      for (const doc of votesRes.documents) {
        const parsed = VoteDocumentDTOSchema.safeParse(doc)
        if (!parsed.success) continue
        const productId = parsed.data.product
        voteCountsByProduct[productId] = (voteCountsByProduct[productId] ?? 0) + 1
        voterIds.add(parsed.data.userId)
      }

      const participationCounts = this.aggregateParticipationCounts(
        participationRes.documents as RawParticipationDoc[]
      )

      const bidsByProduct: Record<string, BidsByProduct> = {}
      for (const doc of bidsRes.documents) {
        const parsed = BidDocumentDTOSchema.safeParse(doc)
        if (!parsed.success) continue
        const bid = mapBidDocumentDTOToEntity(parsed.data)
        const productId = bid.productId
        if (!bidsByProduct[productId]) {
          bidsByProduct[productId] = {
            highestAmount: bid.amount,
            count: 0,
            bids: [],
          }
        }
        bidsByProduct[productId].count += 1
        bidsByProduct[productId].bids.push(bid)
        if (bid.amount > bidsByProduct[productId].highestAmount) {
          bidsByProduct[productId].highestAmount = bid.amount
        }
      }

      const winnerConfirmationsByProduct: Record<string, WinnerConfirmation> = {}
      for (const doc of winnerConfirmationRes.documents) {
        const parsed = WinnerConfirmationDocumentDTOSchema.safeParse(doc)
        if (!parsed.success) continue
        const wc = mapWinnerConfirmationDocumentDTOToEntity(parsed.data)
        const productId = wc.productId
        const existing = winnerConfirmationsByProduct[productId]
        if (!existing) {
          winnerConfirmationsByProduct[productId] = wc
        } else if (wc.status === 'confirmed') {
          winnerConfirmationsByProduct[productId] = wc
        } else if (
          existing.status !== 'confirmed' &&
          wc.fallbackRank < existing.fallbackRank
        ) {
          winnerConfirmationsByProduct[productId] = wc
        }
      }

      return Result.ok({
        voteCountsByProduct,
        distinctVoterCount: voterIds.size,
        participationCounts,
        bidsByProduct,
        winnerConfirmationsByProduct,
      })
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to fetch auction stats'
      return Result.fail(new ServerFailure(message))
    }
  }

  private aggregateParticipationCounts(
    documents: RawParticipationDoc[]
  ): ParticipationCounts {
    const byProduct: Record<string, { approved: number; pending: number }> = {}
    let approved = 0
    let pending = 0

    for (const doc of documents) {
      const productId = doc.product ?? '__unknown__'
      if (!byProduct[productId]) {
        byProduct[productId] = { approved: 0, pending: 0 }
      }
      if (doc.status === 'approved') {
        approved += 1
        byProduct[productId].approved += 1
      } else if (doc.status === 'pending') {
        pending += 1
        byProduct[productId].pending += 1
      }
    }

    return { approved, pending, byProduct }
  }
}
