import { z } from 'zod'

export const ProductDocumentDTOSchema = z.object({
  $id: z.string(),
  $collectionId: z.string().optional(),
  $databaseId: z.string().optional(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  backgroundColorHex: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  auctionRelated: z.boolean().optional().default(false),
})

export type ProductDocumentDTO = z.infer<typeof ProductDocumentDTOSchema>

export const ProductListDTOSchema = z.object({
  total: z.number(),
  documents: z.array(ProductDocumentDTOSchema),
})

export type ProductListDTO = z.infer<typeof ProductListDTOSchema>
