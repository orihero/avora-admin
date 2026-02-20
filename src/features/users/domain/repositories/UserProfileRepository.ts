import type { Result } from '@/core/error'
import type { Failure } from '@/core/error'
import type { UserProfile, UserProfileRole } from '../entities'

export interface CreateUserProfileParams {
  authId: string
  role: UserProfileRole
  phoneNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  avatarUrl?: string | null
}

export type UpdateUserProfileParams = Partial<
  Omit<CreateUserProfileParams, 'authId'>
>

export interface ListUserProfilesParams {
  limit?: number
  offset?: number
  /** Filter by role */
  role?: UserProfileRole
  /** Search in phoneNumber, firstName, lastName */
  search?: string
  orderBy?: string
  orderDesc?: boolean
}

export interface ListUserProfilesResult {
  userProfiles: UserProfile[]
  total: number
}

export interface UserProfileRepository {
  list(params?: ListUserProfilesParams): Promise<Result<ListUserProfilesResult, Failure>>
  getById(id: string): Promise<Result<UserProfile | null, Failure>>
  create(params: CreateUserProfileParams): Promise<Result<UserProfile, Failure>>
  update(id: string, params: UpdateUserProfileParams): Promise<Result<UserProfile, Failure>>
  delete(id: string): Promise<Result<void, Failure>>
}
