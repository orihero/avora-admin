import type { UserProfile } from '@/features/users/domain/entities'
import type { UserProfileDocumentDTO } from '../dto'

export function mapUserProfileDocumentDTOToEntity(dto: UserProfileDocumentDTO): UserProfile {
  return {
    id: dto.$id,
    authId: dto.authId,
    role: dto.role,
    phoneNumber: dto.phoneNumber ?? null,
    firstName: dto.firstName ?? null,
    lastName: dto.lastName ?? null,
    dateOfBirth: dto.dateOfBirth ?? null,
    avatarUrl: dto.avatarUrl ?? null,
    createdAt: dto.$createdAt,
    updatedAt: dto.$updatedAt,
  }
}
