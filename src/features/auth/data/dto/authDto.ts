import { z } from 'zod'

export const AuthTokenDTOSchema = z.object({
  access_token: z.string(),
  expires_at: z.number(),
})

export type AuthTokenDTO = z.infer<typeof AuthTokenDTOSchema>

export const UserProfileDTOSchema = z.object({
  $id: z.string(),
  authId: z.string(),
  role: z.enum(['admin', 'user']),
  phoneNumber: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
})

export type UserProfileDTO = z.infer<typeof UserProfileDTOSchema>
