import type { ParticipationRequest } from '@/features/auction/domain/entities'
import type { AppwriteParticipationRequestDocument } from '../dto/participationRequestDto'

function displayNameFromProfile(
  p: { firstName?: string | null; lastName?: string | null } | undefined
): string {
  if (!p) return ''
  const name = [p.firstName, p.lastName].filter(Boolean).join(' ')
  return name.trim() || '—'
}

export function mapParticipationRequestDocumentToEntity(
  doc: AppwriteParticipationRequestDocument
): ParticipationRequest {
  const user = doc.user
  const userProfileId = typeof user === 'string' ? user : user.$id
  const userDisplayName =
    typeof user === 'object' && user !== null ? displayNameFromProfile(user) : undefined

  const reviewedBy = doc.reviewedBy
  const reviewedByProfileId =
    reviewedBy == null || typeof reviewedBy === 'string' ? reviewedBy ?? null : reviewedBy.$id
  const reviewedByDisplayName =
    typeof reviewedBy === 'object' && reviewedBy !== null
      ? displayNameFromProfile(reviewedBy)
      : undefined

  return {
    id: doc.$id,
    auctionId: doc.auction,
    productId: doc.product ?? null,
    userProfileId,
    phoneNumber: doc.phoneNumber,
    status: doc.status,
    termsAccepted: doc.termsAccepted,
    reviewedAt: doc.reviewedAt ?? null,
    reviewedByProfileId: reviewedByProfileId ?? null,
    userDisplayName,
    reviewedByDisplayName,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  }
}
