import { useTranslation } from 'react-i18next'
import type { Auction } from '@/features/auction/domain/entities'
import type { AuctionStats } from '@/features/auction/domain/repositories'

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export interface AuctionDetailsSidebarProps {
  auction: Auction
  stats: AuctionStats | null | undefined
  categoryCount: number
  displayedProductCount: number
}

export function AuctionDetailsSidebar({
  auction,
  stats,
  categoryCount,
  displayedProductCount,
}: AuctionDetailsSidebarProps) {
  const { t } = useTranslation()

  const showVoters =
    auction.progress === 'voting_open' || auction.progress === 'voting_closed'
  const showParticipants =
    auction.progress === 'participation_approval' ||
    auction.progress === 'live_auction' ||
    auction.progress === 'winner_confirmation' ||
    auction.progress === 'fallback_resolution'
  const voterCount = stats?.distinctVoterCount ?? 0
  const participantCount = stats?.participationCounts?.approved ?? 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {t('pages.auctionDetailsAuctionData')}
      </h2>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-slate-500 dark:text-slate-400">
            {t('pages.auctionDetailsStartDate')}
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
            {formatDateTime(auction.startAt)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500 dark:text-slate-400">
            {t('pages.auctionDetailsVotingEndDate')}
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
            {formatDateTime(auction.votingEndAt)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500 dark:text-slate-400">
            {t('pages.auctionDetailsCategories')}
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
            {categoryCount}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500 dark:text-slate-400">
            {t('pages.auctionDetailsProducts')}
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
            {displayedProductCount}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500 dark:text-slate-400">
            {t('pages.auctionDetailsVoters')}
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
            {showVoters ? voterCount : '—'}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500 dark:text-slate-400">
            {t('pages.auctionDetailsParticipants')}
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
            {showParticipants ? participantCount : '—'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
