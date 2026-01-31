import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import type { AuctionProduct } from '@/features/auction/domain/entities'
import type { Product } from '@/features/products/domain/entities'
import type { WinnerConfirmationStatus } from '@/features/auction/domain/entities'
import { useTranslation } from 'react-i18next'

export interface AuctionProductCardProps {
  auctionProduct: AuctionProduct
  product?: Product | null
  /** Use smaller layout for horizontal scroll */
  compact?: boolean
  /** When true, show vote count (for voting_open, voting_closed) */
  showVoteCount?: boolean
  voteCount?: number
  showSelectedBadge?: boolean
  participationCounts?: { approved: number; pending: number }
  highestBid?: number
  bidCount?: number
  winnerStatus?: WinnerConfirmationStatus
  isLive?: boolean
}

export function AuctionProductCard({
  auctionProduct,
  product,
  compact = false,
  showVoteCount = false,
  voteCount = 0,
  showSelectedBadge = false,
  participationCounts,
  highestBid,
  bidCount = 0,
  winnerStatus,
  isLive = false,
}: AuctionProductCardProps) {
  const { t } = useTranslation()
  const name = product?.name ?? t('pages.auctionDetailsUnknownProduct')
  const imageUrl = product?.imageUrl
  const showParticipation = participationCounts != null
  const showBids = highestBid != null || bidCount > 0
  const showWinnerStatus = winnerStatus != null

  return (
    <div
      className={cn(
        'rounded-xl border shadow-sm',
        compact ? 'p-2.5' : 'p-4',
        isLive
          ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-400 dark:bg-emerald-950/30'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      )}
    >
      <div className={cn('flex flex-col', compact ? 'gap-2' : 'gap-3')}>
        {isLive && (
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-full bg-emerald-100 font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
              compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
            )}
          >
            <Icon icon="material-symbols:live-tv" className="h-3.5 w-3.5" />
            {t('pages.auctionDetailsLive')}
          </span>
        )}
        {showSelectedBadge && auctionProduct.selectedForLive && (
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-full bg-blue-100 font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
              compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'
            )}
          >
            <Icon icon="material-symbols:check-circle-outline" className="h-3.5 w-3.5" />
            {t('pages.auctionDetailsSelected')}
          </span>
        )}
        {imageUrl ? (
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <span
              className={cn(
                'text-slate-500 dark:text-slate-400',
                compact ? 'text-xs' : 'text-sm'
              )}
            >
              {name}
            </span>
          </div>
        )}
        <div>
          <p
            className={cn(
              'font-medium text-slate-900 dark:text-slate-100',
              compact && 'truncate text-sm'
            )}
          >
            {name}
          </p>
          {product?.brand && (
            <p
              className={cn(
                'text-slate-600 dark:text-slate-400',
                compact ? 'truncate text-xs' : 'text-sm'
              )}
            >
              {product.brand}
            </p>
          )}
          {showVoteCount && (
            <p
              className={cn(
                'mt-0.5 text-slate-600 dark:text-slate-400',
                compact ? 'text-xs' : 'mt-1 text-sm'
              )}
            >
              {t('pages.auctionDetailsVotes', { count: voteCount })}
            </p>
          )}
          {showParticipation && (
            <p
              className={cn(
                'text-slate-600 dark:text-slate-400',
                compact ? 'mt-0.5 text-xs' : 'mt-1 text-sm'
              )}
            >
              {t('pages.auctionDetailsParticipationCounts', {
                approved: participationCounts.approved,
                pending: participationCounts.pending,
              })}
            </p>
          )}
          {showBids && (
            <p
              className={cn(
                'text-slate-600 dark:text-slate-400',
                compact ? 'mt-0.5 text-xs' : 'mt-1 text-sm'
              )}
            >
              {highestBid != null && (
                <span>
                  {t('pages.auctionDetailsCurrentPrice')}:{' '}
                  {t('pages.auctionDetailsPriceFormat', { value: highestBid })}
                </span>
              )}
              {bidCount > 0 && (
                <span className={highestBid != null ? ' ml-2' : ''}>
                  {t('pages.auctionDetailsBidCount', { count: bidCount })}
                </span>
              )}
            </p>
          )}
          {showWinnerStatus && (
            <p
              className={cn(
                'text-slate-600 dark:text-slate-400',
                compact ? 'mt-0.5 text-xs' : 'mt-1 text-sm'
              )}
            >
              {t('pages.auctionDetailsWinnerStatusLabel')}:{' '}
              {t(`pages.auctionDetailsWinnerStatus_${winnerStatus}`)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
