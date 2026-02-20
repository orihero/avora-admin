import { Result, ValidationFailure, ServerFailure } from '@/core/error'
import type { UserProfile } from '@/features/users/domain/entities'
import type {
  UserProfileRepository,
  CreateUserProfileParams,
  ListUserProfilesParams,
  ListUserProfilesResult,
  UpdateUserProfileParams,
} from '@/features/users/domain/repositories'
import { mapUserProfileDocumentDTOToEntity } from '@/features/users/data/mappers'
import { UserProfileDocumentDTOSchema } from '@/features/users/data/dto'
import { AppwriteUserProfileDataSource } from '@/features/users/data/datasources'

export class UserProfileRepositoryImpl implements UserProfileRepository {
  constructor(private readonly dataSource: AppwriteUserProfileDataSource) {}

  async getById(id: string): Promise<Result<UserProfile | null, ValidationFailure | ServerFailure>> {
    try {
      const row = await this.dataSource.getRow(id)
      if (!row) return Result.ok(null)
      const parsed = UserProfileDocumentDTOSchema.safeParse(row)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(`Invalid user profile row ${row.$id}: ${parsed.error.message}`)
        )
      }
      return Result.ok(mapUserProfileDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to get user profile'
      return Result.fail(new ServerFailure(message))
    }
  }

  async list(
    params?: ListUserProfilesParams
  ): Promise<Result<ListUserProfilesResult, ValidationFailure | ServerFailure>> {
    try {
      const response = await this.dataSource.listRows(params)
      const userProfiles: ListUserProfilesResult['userProfiles'] = []
      for (const row of response.rows) {
        const parsed = UserProfileDocumentDTOSchema.safeParse(row)
        if (!parsed.success) {
          return Result.fail(
            new ValidationFailure(
              `Invalid user profile row ${row.$id}: ${parsed.error.message}`
            )
          )
        }
        userProfiles.push(mapUserProfileDocumentDTOToEntity(parsed.data))
      }
      return Result.ok({ userProfiles, total: response.total })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to list user profiles'
      return Result.fail(new ServerFailure(message))
    }
  }

  async create(
    params: CreateUserProfileParams
  ): Promise<Result<UserProfile, ValidationFailure | ServerFailure>> {
    try {
      const row = await this.dataSource.createRow({
        authId: params.authId,
        role: params.role,
        phoneNumber: params.phoneNumber ?? null,
        firstName: params.firstName ?? null,
        lastName: params.lastName ?? null,
        dateOfBirth: params.dateOfBirth ?? null,
        avatarUrl: params.avatarUrl ?? null,
      })
      const parsed = UserProfileDocumentDTOSchema.safeParse(row)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(`Invalid user profile row ${row.$id}: ${parsed.error.message}`)
        )
      }
      return Result.ok(mapUserProfileDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create user profile'
      return Result.fail(new ServerFailure(message))
    }
  }

  async update(
    id: string,
    params: UpdateUserProfileParams
  ): Promise<Result<UserProfile, ValidationFailure | ServerFailure>> {
    try {
      const row = await this.dataSource.updateRow(id, {
        role: params.role,
        phoneNumber: params.phoneNumber,
        firstName: params.firstName,
        lastName: params.lastName,
        dateOfBirth: params.dateOfBirth,
        avatarUrl: params.avatarUrl,
      })
      const parsed = UserProfileDocumentDTOSchema.safeParse(row)
      if (!parsed.success) {
        return Result.fail(
          new ValidationFailure(`Invalid user profile row ${row.$id}: ${parsed.error.message}`)
        )
      }
      return Result.ok(mapUserProfileDocumentDTOToEntity(parsed.data))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update user profile'
      return Result.fail(new ServerFailure(message))
    }
  }

  async delete(id: string): Promise<Result<void, ValidationFailure | ServerFailure>> {
    try {
      await this.dataSource.deleteRow(id)
      return Result.ok(undefined)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete user profile'
      return Result.fail(new ServerFailure(message))
    }
  }
}
