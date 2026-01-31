import { z } from 'zod'

/** System fields from Appwrite document; rest are custom attributes */
const appwriteSystemFields = z.object({
  $id: z.string(),
  $collectionId: z.string().optional(),
  $databaseId: z.string().optional(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
})

/** Variables document: system fields + arbitrary attributes (passthrough) */
export const VariableDocumentDTOSchema = appwriteSystemFields.catchall(z.unknown())
export type VariableDocumentDTO = z.infer<typeof VariableDocumentDTOSchema>

export const VariableListDTOSchema = z.object({
  total: z.number(),
  documents: z.array(VariableDocumentDTOSchema),
})
export type VariableListDTO = z.infer<typeof VariableListDTOSchema>
