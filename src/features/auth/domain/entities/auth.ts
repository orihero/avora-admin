/**
 * Auth domain entities.
 */

export interface AuthToken {
  accessToken: string
  expiresAt: number
}

export interface User {
  id: string
  email: string
  fullName: string
}

/** Profile from user_profiles table (authId = Appwrite session userId). */
export interface UserProfile {
  id: string
  authId: string
  role: 'admin' | 'user'
  phoneNumber: string | null
  firstName: string | null
  lastName: string | null
  dateOfBirth: string | null
  avatarUrl: string | null
}

/** Result of login: token + profile (profile null if no user_profiles row). */
export interface LoginResult {
  token: AuthToken
  profile: UserProfile | null
}
