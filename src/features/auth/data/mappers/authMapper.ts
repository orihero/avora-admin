import type { AuthToken, UserProfile } from '@/features/auth/domain/entities'
import type { AuthTokenDTO, UserProfileDTO } from '../dto'

export function mapAuthTokenDTOToEntity(dto: AuthTokenDTO): AuthToken {
  return {
    accessToken: dto.access_token,
    expiresAt: dto.expires_at,
  }
}

export function mapUserProfileDTOToEntity(dto: UserProfileDTO): UserProfile {
  return {
    id: dto.$id,
    authId: dto.authId,
    role: dto.role,
    phoneNumber: dto.phoneNumber ?? null,
    firstName: dto.firstName ?? null,
    lastName: dto.lastName ?? null,
    dateOfBirth: dto.dateOfBirth ?? null,
    avatarUrl: dto.avatarUrl ?? null,
  }
}
