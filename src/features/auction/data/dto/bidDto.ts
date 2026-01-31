import { z } from 'zod'

export const BidDocumentDTOSchema = z.object({
  $id: z.string(),
  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
  auction: z.string(),
  product: z.string(),
  userId: z.string(),
  phoneNumber: z.string(),
  amount: z.number(),
  fallbackRank: z.number().optional(),
  createdAt: z.string(),
}).passthrough()

export type BidDocumentDTO = z.infer<typeof BidDocumentDTOSchema>
