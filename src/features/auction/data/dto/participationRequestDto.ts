import { z } from 'zod'

const statusEnum = z.enum(['pending', 'approved', 'declined'])

export const ParticipationRequestDocumentDTOSchema = z.object({
  $id: z.string(),
  $collectionId: z.string().optional(),
  $databaseId: z.string().optional(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
  auction: z.string(),
  product: z.string().nullable().optional(),
  user: z.string(), // relation ID when not expanded
  phoneNumber: z.string(),
  status: statusEnum,
  termsAccepted: z.boolean(),
  reviewedAt: z.string().nullable().optional(),
  reviewedBy: z.string().nullable().optional(), // relation ID when not expanded; optional if column exists
}).passthrough()

export type ParticipationRequestDocumentDTO = z.infer<typeof ParticipationRequestDocumentDTOSchema>

/** Raw document as returned by Appwrite (may have expanded user/reviewedBy as objects) */
export interface AppwriteParticipationRequestDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
  auction: string
  product?: string | null
  user: string | { $id: string; firstName?: string | null; lastName?: string | null; phoneNumber?: string | null }
  phoneNumber: string
  status: 'pending' | 'approved' | 'declined'
  termsAccepted: boolean
  reviewedAt?: string | null
  reviewedBy?: string | null | { $id: string; firstName?: string | null; lastName?: string | null }
}

export const ParticipationRequestListDTOSchema = z.object({
  total: z.number(),
  documents: z.array(z.unknown()),
})

export type ParticipationRequestListDTO = z.infer<typeof ParticipationRequestListDTOSchema>
