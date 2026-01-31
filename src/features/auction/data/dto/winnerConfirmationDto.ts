import { z } from 'zod'

const statusEnum = z.enum([
  'pending_confirmation',
  'confirmed',
  'rejected',
  'payment_failed',
  'unreachable',
])

export const WinnerConfirmationDocumentDTOSchema = z.object({
  $id: z.string(),
  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
  auction: z.string(),
  product: z.string(),
  userId: z.string(),
  status: statusEnum,
  confirmedAt: z.string().nullable().optional(),
  fallbackRank: z.number(),
}).passthrough()

export type WinnerConfirmationDocumentDTO = z.infer<typeof WinnerConfirmationDocumentDTOSchema>
