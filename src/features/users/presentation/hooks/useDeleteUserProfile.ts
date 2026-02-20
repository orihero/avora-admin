import { useMutation, useQueryClient } from '@tanstack/react-query'
import { container } from '@/di/container'
import { USER_PROFILE_REPOSITORY_TOKEN } from '@/di/container'
import type { UserProfileRepository } from '@/features/users/domain/repositories'

export function useDeleteUserProfile() {
  const queryClient = useQueryClient()
  const repo = container.resolve<UserProfileRepository>(USER_PROFILE_REPOSITORY_TOKEN)

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await repo.delete(id)
      if (!result.success) throw new Error(result.error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] })
    },
  })
}
