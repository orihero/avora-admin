/**
 * User profile domain entity (matches user_profiles table + system attributes).
 * authId links to Appwrite Auth user $id (phone is stored in Auth, not as DB primary key).
 */

export type UserProfileRole = 'admin' | 'user'

export interface UserProfile {
  id: string
  authId: string
  role: UserProfileRole
  phoneNumber: string | null
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}
