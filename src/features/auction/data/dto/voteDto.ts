import { z } from 'zod'

export const VoteDocumentDTOSchema = z.object({
  $id: z.string(),
  $createdAt: z.string().optional(),
  $updatedAt: z.string().optional(),
  auction: z.string(),
  product: z.string(),
  userId: z.string(),
  updatedAt: z.string(),
}).passthrough()

export type VoteDocumentDTO = z.infer<typeof VoteDocumentDTOSchema>
