import { useQuery } from '@tanstack/react-query'
import { container } from '@/di/container'
import { USER_PROFILE_REPOSITORY_TOKEN } from '@/di/container'
import type {
  UserProfileRepository,
  ListUserProfilesParams,
} from '@/features/users/domain/repositories'

export interface UseUsersParams extends ListUserProfilesParams {}

export function useUsers(params?: UseUsersParams) {
  const repo = container.resolve<UserProfileRepository>(USER_PROFILE_REPOSITORY_TOKEN)

  return useQuery({
    queryKey: ['userProfiles', params],
    queryFn: async () => {
      const result = await repo.list(params)
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
  })
}
