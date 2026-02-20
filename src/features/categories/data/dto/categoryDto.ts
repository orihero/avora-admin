import { z } from 'zod'

/** Appwrite categories table row (Tables DB). */
export const CategoryRowDTOSchema = z.object({
  $id: z.string(),
  $sequence: z.number().optional(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
  $databaseId: z.string().optional(),
  $tableId: z.string().optional(),
  name: z.string(),
})

export type CategoryRowDTO = z.infer<typeof CategoryRowDTOSchema>
