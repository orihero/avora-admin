import { Result, ValidationFailure, ServerFailure, NetworkFailure, AccessDeniedFailure } from '@/core/error'
import type { AuthRepository, LoginParams } from '@/features/auth/domain/repositories'
import type { LoginResult } from '@/features/auth/domain/entities'
import type { Failure } from '@/core/error'
import { AppwriteAuthDatasource } from '../datasources'
import { mapAuthTokenDTOToEntity, mapUserProfileDTOToEntity } from '../mappers'
import { UserProfileDTOSchema } from '../dto'

function mapAppwriteError(error: unknown): Failure {
  if (error instanceof Error) {
    const message = error.message
    const code = (error as { code?: number }).code
    if (code === 401 || message.toLowerCase().includes('invalid') || message.toLowerCase().includes('unauthorized')) {
      return new ValidationFailure(message || 'Invalid credentials')
    }
    if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
      return new NetworkFailure(message)
    }
    return new ServerFailure(message)
  }
  return new ServerFailure('An unexpected error occurred')
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AppwriteAuthDatasource) {}

  async login(params: LoginParams): Promise<Result<LoginResult, Failure>> {
    try {
      const session = await this.datasource.login(params.email, params.password)
      const token = mapAuthTokenDTOToEntity({
        access_token: session.sessionId,
        expires_at: new Date(session.expire).getTime(),
      })

      let profile: LoginResult['profile'] = null
      const profileDoc = await this.datasource.getUserProfileByAuthId(session.userId)
      if (profileDoc) {
        const parsed = UserProfileDTOSchema.safeParse(profileDoc)
        if (parsed.success) {
          profile = mapUserProfileDTOToEntity(parsed.data)
        }
      }

      const isAdmin = profile?.role === 'admin'
      if (!profile || !isAdmin) {
        await this.datasource.logout()
        return Result.fail(
          new AccessDeniedFailure(
            'Access denied. Only users with administrator role can sign in.'
          )
        )
      }

      return Result.ok({ token, profile })
    } catch (error) {
      return Result.fail(mapAppwriteError(error))
    }
  }

  async getCurrentSession(): Promise<Result<LoginResult | null, Failure>> {
    try {
      const session = await this.datasource.getCurrentSession()
      if (!session) {
        return Result.ok(null)
      }
      const token = mapAuthTokenDTOToEntity({
        access_token: session.sessionId,
        expires_at: new Date(session.expire).getTime(),
      })
      let profile: LoginResult['profile'] = null
      const profileDoc = await this.datasource.getUserProfileByAuthId(session.userId)
      if (profileDoc) {
        const parsed = UserProfileDTOSchema.safeParse(profileDoc)
        if (parsed.success) {
          profile = mapUserProfileDTOToEntity(parsed.data)
        }
      }
      return Result.ok({ token, profile })
    } catch (error) {
      return Result.fail(mapAppwriteError(error))
    }
  }

  async logout(): Promise<Result<void, Failure>> {
    try {
      await this.datasource.logout()
      return Result.ok(undefined)
    } catch (error) {
      // 401 = session already invalid or cookie not sent (e.g. cross-origin). Treat as logged out.
      if (error instanceof Error) {
        const code = (error as { code?: number }).code
        const message = error.message.toLowerCase()
        if (code === 401 || message.includes('unauthorized') || message.includes('401')) {
          return Result.ok(undefined)
        }
      }
      return Result.fail(mapAppwriteError(error))
    }
  }
}
