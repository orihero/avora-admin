import { z } from 'zod'

const auctionStatusEnum = z.enum([
  'draft',
  'scheduled',
  'active',
  'completed',
  'cancelled',
])
const auctionProgressEnum = z.enum([
  'voting_open',
  'voting_closed',
  'participation_approval',
  'live_auction',
  'winner_confirmation',
  'fallback_resolution',
])

export const AuctionDocumentDTOSchema = z.object({
  $id: z.string(),
  $collectionId: z.string().optional(),
  $databaseId: z.string().optional(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  startAt: z.string(),
  votingEndAt: z.string(),
  liveAuctionStartAt: z.string().nullable().optional(),
  status: auctionStatusEnum,
  progress: auctionProgressEnum,
  pausedAt: z.string().nullable().optional(),
  extendedEndAt: z.string().nullable().optional(),
})

export type AuctionDocumentDTO = z.infer<typeof AuctionDocumentDTOSchema>

export const AuctionListDTOSchema = z.object({
  total: z.number(),
  documents: z.array(AuctionDocumentDTOSchema),
})

export type AuctionListDTO = z.infer<typeof AuctionListDTOSchema>
