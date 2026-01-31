import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { Bid, WinnerConfirmation } from '../entities'

export interface ParticipationCounts {
  approved: number
  pending: number
  byProduct: Record<string, { approved: number; pending: number }>
}

export interface BidsByProduct {
  highestAmount: number
  count: number
  bids: Bid[]
}

export interface AuctionStats {
  voteCountsByProduct: Record<string, number>
  distinctVoterCount: number
  participationCounts: ParticipationCounts
  bidsByProduct: Record<string, BidsByProduct>
  winnerConfirmationsByProduct: Record<string, WinnerConfirmation>
}

export interface AuctionStatsRepository {
  getAuctionStats(auctionId: string): Promise<Result<AuctionStats, Failure>>
}
