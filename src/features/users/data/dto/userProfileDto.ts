import { z } from 'zod'

const userProfileRoleEnum = z.enum(['admin', 'user'])

export const UserProfileDocumentDTOSchema = z.object({
  $id: z.string(),
  $collectionId: z.string().optional(),
  $databaseId: z.string().optional(),
  $tableId: z.string().optional(),
  $createdAt: z.string(),
  $updatedAt: z.string(),
  $permissions: z.array(z.string()).optional(),
  authId: z.string(),
  role: userProfileRoleEnum,
  phoneNumber: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
})

export type UserProfileDocumentDTO = z.infer<typeof UserProfileDocumentDTOSchema>
