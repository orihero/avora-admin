/**
 * Auction domain entity (matches Appwrite auctions table + system attributes).
 */

export type AuctionStatus =
  | 'draft'
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'cancelled'

export type AuctionProgress =
  | 'voting_open'
  | 'voting_closed'
  | 'participation_approval'
  | 'live_auction'
  | 'winner_confirmation'
  | 'fallback_resolution'

export interface Auction {
  id: string
  title: string
  description: string | null
  startAt: string
  votingEndAt: string
  status: AuctionStatus
  progress: AuctionProgress
  pausedAt: string | null
  extendedEndAt: string | null
  createdAt: string
  updatedAt: string
}
