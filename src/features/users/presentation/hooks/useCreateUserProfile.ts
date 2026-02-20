import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { USER_PROFILE_REPOSITORY_TOKEN } from '@/di/container'
import type {
  UserProfileRepository,
  CreateUserProfileParams,
} from '@/features/users/domain/repositories'

export function useCreateUserProfile() {
  const queryClient = useQueryClient()
  const repo = container.resolve<UserProfileRepository>(USER_PROFILE_REPOSITORY_TOKEN)

  return useMutation({
    mutationFn: async (params: CreateUserProfileParams) => {
      const result = await repo.create(params)
      if (!result.success) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] })
    },
  })
}
