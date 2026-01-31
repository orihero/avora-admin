/**
 * Participation request domain entity (matches Appwrite participation_requests table).
 */

export type ParticipationRequestStatus = 'pending' | 'approved' | 'declined'

export interface ParticipationRequest {
  id: string
  auctionId: string
  productId: string | null
  /** user_profiles document ID (relation) */
  userProfileId: string
  phoneNumber: string
  status: ParticipationRequestStatus
  termsAccepted: boolean
  reviewedAt: string | null
  /** user_profiles document ID of reviewer (relation, optional) */
  reviewedByProfileId: string | null
  /** Display name from expanded user relation (optional) */
  userDisplayName?: string
  /** Display name from expanded reviewedBy relation (optional) */
  reviewedByDisplayName?: string
  createdAt: string
  updatedAt: string
}
