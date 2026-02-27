import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { Auction, AuctionStatus, AuctionProgress } from '../entities'

export interface CreateAuctionParams {
  title: string
  description: string | null
  startAt: string
  votingEndAt: string
  liveAuctionStartAt: string | null
  status: AuctionStatus
  progress: AuctionProgress
}

export type UpdateAuctionParams = CreateAuctionParams

export interface ListAuctionsParams {
  limit?: number
  offset?: number
  /** Filter by status (exact match) */
  status?: string
  /** Filter by progress (exact match) */
  progress?: string
  /** Search in title (case-insensitive contains) */
  titleSearch?: string
  /** Sort field: e.g. startAt, votingEndAt, liveAuctionStartAt, title, status, progress */
  orderBy?: string
  /** Sort direction */
  orderDesc?: boolean
}

export interface ListAuctionsResult {
  auctions: Auction[]
  total: number
}

export interface AuctionRepository {
  list(params?: ListAuctionsParams): Promise<Result<ListAuctionsResult, Failure>>
  getById(id: string): Promise<Result<Auction | null, Failure>>
  create(params: CreateAuctionParams): Promise<Result<Auction, Failure>>
  update(id: string, params: UpdateAuctionParams): Promise<Result<Auction, Failure>>
  delete(id: string): Promise<Result<void, Failure>>
}
