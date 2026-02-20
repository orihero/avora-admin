import { Query, ID } from 'appwrite'
import {
  AVORA_DATABASE_ID,
  USER_PROFILES_COLLECTION_ID,
  tablesDbListRows,
  tablesDbGetRow,
  tablesDbCreateRow,
  tablesDbUpdateRow,
  tablesDbDeleteRow,
} from '@/core/appwrite/client'
import type { ListUserProfilesParams } from '@/features/users/domain/repositories'

/** Row shape from Tables DB user_profiles table. */
export interface AppwriteUserProfileRow {
  $id: string
  $sequence?: number
  $createdAt: string
  $updatedAt: string
  $permissions?: string[]
  $databaseId?: string
  $tableId?: string
  authId: string
  role: string
  phoneNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  avatarUrl?: string | null
}

export interface CreateUserProfilePayload {
  authId: string
  role: string
  phoneNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  avatarUrl?: string | null
}

export interface AppwriteUserProfileListResponse {
  total: number
  rows: AppwriteUserProfileRow[]
}

export class AppwriteUserProfileDataSource {
  async getRow(id: string): Promise<AppwriteUserProfileRow | null> {
    return tablesDbGetRow<AppwriteUserProfileRow>(
      AVORA_DATABASE_ID,
      USER_PROFILES_COLLECTION_ID,
      id
    )
  }

  async listRows(params?: ListUserProfilesParams): Promise<AppwriteUserProfileListResponse> {
    const queries: string[] = []

    if (params?.role) {
      queries.push(Query.equal('role', params.role))
    }
    if (params?.search?.trim()) {
      const term = params.search.trim()
      queries.push(Query.search('phoneNumber', term))
    }

    const orderBy = params?.orderBy ?? '$createdAt'
    if (params?.orderDesc) {
      queries.push(Query.orderDesc(orderBy))
    } else {
      queries.push(Query.orderAsc(orderBy))
    }
    if (params?.limit != null) {
      queries.push(Query.limit(params.limit))
    }
    if (params?.offset != null) {
      queries.push(Query.offset(params.offset))
    }

    const { total, rows } = await tablesDbListRows<AppwriteUserProfileRow>(
      AVORA_DATABASE_ID,
      USER_PROFILES_COLLECTION_ID,
      queries.length > 0 ? queries : undefined
    )

    return { total, rows }
  }

  async createRow(data: CreateUserProfilePayload): Promise<AppwriteUserProfileRow> {
    return tablesDbCreateRow<AppwriteUserProfileRow>(
      AVORA_DATABASE_ID,
      USER_PROFILES_COLLECTION_ID,
      ID.unique(),
      {
        authId: data.authId,
        role: data.role,
        phoneNumber: data.phoneNumber ?? null,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        dateOfBirth: data.dateOfBirth ?? null,
        avatarUrl: data.avatarUrl ?? null,
      }
    )
  }

  async updateRow(
    id: string,
    data: Partial<CreateUserProfilePayload>
  ): Promise<AppwriteUserProfileRow> {
    const payload: Record<string, unknown> = {}
    if (data.role !== undefined) payload.role = data.role
    if (data.phoneNumber !== undefined) payload.phoneNumber = data.phoneNumber
    if (data.firstName !== undefined) payload.firstName = data.firstName
    if (data.lastName !== undefined) payload.lastName = data.lastName
    if (data.dateOfBirth !== undefined) payload.dateOfBirth = data.dateOfBirth
    if (data.avatarUrl !== undefined) payload.avatarUrl = data.avatarUrl
    return tablesDbUpdateRow<AppwriteUserProfileRow>(
      AVORA_DATABASE_ID,
      USER_PROFILES_COLLECTION_ID,
      id,
      payload
    )
  }

  async deleteRow(id: string): Promise<void> {
    await tablesDbDeleteRow(AVORA_DATABASE_ID, USER_PROFILES_COLLECTION_ID, id)
  }
}
