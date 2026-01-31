import { z } from 'zod'

/** Appwrite may return relation attributes as ID string or as relation object { $id } when listing. */
const relationId = z.union([
  z.string(),
  z.object({ $id: z.string() }).transform((o) => o.$id),
])

export const AuctionProductDocumentDTOSchema = z.object({
  $id: z.string(),
  $collectionId: z.string().optional(),
  $databaseId: z.string().optional(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
  auction: relationId,
  product: relationId,
  sortOrder: z.number(),
  minBidPrice: z.number(),
  selectedForLive: z.boolean(),
  price_increment_presets: z.array(z.string()).optional().default([]),
})

export type AuctionProductDocumentDTO = z.infer<typeof AuctionProductDocumentDTOSchema>
