import type { UserProfile } from '@/features/auth/domain/entities'

export function getProfileDisplayName(profile: UserProfile | null): string {
  if (!profile) return 'User'
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
  return name || 'User'
}

export function getProfileRoleLabel(profile: UserProfile | null): string {
  if (!profile?.role) return ''
  return profile.role === 'admin' ? 'Admin' : profile.role === 'user' ? 'User' : ''
}
