/**
 * Winner confirmation domain entity (matches Appwrite winner_confirmation table).
 */

export type WinnerConfirmationStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'rejected'
  | 'payment_failed'
  | 'unreachable'

export interface WinnerConfirmation {
  id: string
  auctionId: string
  productId: string
  userId: string
  status: WinnerConfirmationStatus
  confirmedAt: string | null
  fallbackRank: number
  createdAt: string
  updatedAt: string
}
