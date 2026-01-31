import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { container } from '@/di/container'
import { AUCTION_REPOSITORY_TOKEN } from '@/di/container'
import type { AuctionRepository } from '@/features/auction/domain/repositories'
import type { Auction } from '@/features/auction/domain/entities'

/**
 * Returns the "featured" auction for the sidebar: first active, else first
 * completed, else most recent upcoming (scheduled). Used to conditionally
 * show the "Ongoing auction" menu level.
 */
export function useFeaturedAuction(): {
  auction: Auction | null
  isLoading: boolean
  isError: boolean
} {
  const repo = container.resolve<AuctionRepository>(AUCTION_REPOSITORY_TOKEN)

  const [activeQuery, completedQuery, scheduledQuery] = useQueries({
    queries: [
      {
        queryKey: ['auctions', { status: 'active', limit: 1 }],
        queryFn: async () => {
          const result = await repo.list({
            status: 'active',
            limit: 1,
            orderBy: 'startAt',
            orderDesc: false,
          })
          if (!result.success) throw new Error(result.error.message)
          return result.data
        },
      },
      {
        queryKey: ['auctions', { status: 'completed', limit: 1 }],
        queryFn: async () => {
          const result = await repo.list({
            status: 'completed',
            limit: 1,
            orderBy: 'votingEndAt',
            orderDesc: true,
          })
          if (!result.success) throw new Error(result.error.message)
          return result.data
        },
      },
      {
        queryKey: ['auctions', { status: 'scheduled', limit: 1 }],
        queryFn: async () => {
          const result = await repo.list({
            status: 'scheduled',
            limit: 1,
            orderBy: 'startAt',
            orderDesc: false,
          })
          if (!result.success) throw new Error(result.error.message)
          return result.data
        },
      },
    ],
  })

  const auction = useMemo(() => {
    const active = activeQuery.data?.auctions?.[0]
    const completed = completedQuery.data?.auctions?.[0]
    const scheduled = scheduledQuery.data?.auctions?.[0]
    return active ?? completed ?? scheduled ?? null
  }, [
    activeQuery.data?.auctions,
    completedQuery.data?.auctions,
    scheduledQuery.data?.auctions,
  ])

  const isLoading = activeQuery.isLoading || completedQuery.isLoading || scheduledQuery.isLoading
  const isError = activeQuery.isError || completedQuery.isError || scheduledQuery.isError

  return { auction, isLoading, isError }
}
