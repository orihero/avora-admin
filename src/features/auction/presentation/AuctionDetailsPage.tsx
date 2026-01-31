import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/core/components'
import type { Product } from '@/features/products/domain/entities'
import type { AuctionProduct } from '@/features/auction/domain/entities'
import { useAuction, useAuctionProducts, useAuctionStats } from './hooks'
import { useProducts } from '@/features/products/presentation/hooks'
import { AuctionProductCard } from './components/AuctionProductCard'
import { AuctionDetailsSidebar } from './components/AuctionDetailsSidebar'
import { AuctionProgressBadge } from './components/AuctionProgressBadge'
import { AuctionStatusBadge } from './components/AuctionStatusBadge'
import officeChairImage from '../assets/office-chair.svg'

const VOTING_PROGRESS = ['voting_open', 'voting_closed'] as const
const SELECTED_ONLY_PROGRESS = [
  'participation_approval',
  'live_auction',
  'winner_confirmation',
  'fallback_resolution',
] as const

function filterProductsByProgress(
  auctionProducts: AuctionProduct[],
  progress: string
): AuctionProduct[] {
  if (VOTING_PROGRESS.includes(progress as (typeof VOTING_PROGRESS)[number])) {
    return auctionProducts
  }
  if (
    SELECTED_ONLY_PROGRESS.includes(
      progress as (typeof SELECTED_ONLY_PROGRESS)[number]
    )
  ) {
    return auctionProducts.filter((ap) => ap.selectedForLive)
  }
  return auctionProducts
}

function getLiveProductId(auctionProducts: AuctionProduct[]): string | null {
  const selected = auctionProducts
    .filter((ap) => ap.selectedForLive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  return selected[0]?.productId ?? null
}

export function AuctionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { data: auction, isLoading: auctionLoading, isError: auctionError } = useAuction(id)
  const { data: auctionProducts = [], isLoading: productsLoading } = useAuctionProducts(id)
  const { data: stats, isLoading: statsLoading } = useAuctionStats(id)
  const { data: productsData } = useProducts()

  const productMap = useMemo(() => {
    if (!productsData?.products) return new Map<string, Product>()
    return new Map(productsData.products.map((p) => [p.id, p]))
  }, [productsData?.products])

  const displayedProducts = useMemo(() => {
    if (!auction) return auctionProducts
    return filterProductsByProgress(auctionProducts, auction.progress)
  }, [auction, auctionProducts])

  const categoryCount = useMemo(() => {
    const ids = new Set<string>()
    for (const ap of displayedProducts) {
      const product = productMap.get(ap.productId)
      if (product?.categoryId) ids.add(product.categoryId)
    }
    return ids.size
  }, [displayedProducts, productMap])

  const liveProductId = useMemo(
    () => (auction?.progress === 'live_auction' ? getLiveProductId(auctionProducts) : null),
    [auction?.progress, auctionProducts]
  )

  if (!id) {
    return (
      <div className="min-h-screen bg-white p-6 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">{t('pages.auctionNotFound')}</p>
        <Link to="/auction" className="mt-2 inline-block text-primary-600 hover:underline dark:text-primary-400">
          {t('pages.breadcrumbAuctions')}
        </Link>
      </div>
    )
  }

  if (auctionLoading && !auction) {
    return (
      <div className="min-h-screen bg-white p-6 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    )
  }

  if (auctionError || !auction) {
    return (
      <div className="min-h-screen bg-white p-6 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">{t('pages.auctionNotFound')}</p>
        <Link to="/auction" className="mt-2 inline-block text-primary-600 hover:underline dark:text-primary-400">
          {t('pages.breadcrumbAuctions')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6 dark:bg-slate-900">
      <div className="mb-6">
        <PageHeader
          title={auction.title}
          breadcrumbItems={[
            { label: t('pages.breadcrumbData'), path: '/' },
            { label: t('pages.breadcrumbAuctions'), path: '/auction' },
            { label: auction.title },
          ]}
          illustrationSrc={officeChairImage}
          illustrationAlt={t('pages.auctionDetailsIllustrationAlt')}
        />
        <div className="-mt-2 flex flex-wrap items-center gap-2">
          <AuctionStatusBadge status={auction.status} />
          <AuctionProgressBadge progress={auction.progress} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('pages.auctionDetailsProducts')}
          </h2>
          {productsLoading ? (
            <p className="text-slate-600 dark:text-slate-400">Loading products...</p>
          ) : displayedProducts.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">
              {auction.progress === 'voting_open' || auction.progress === 'voting_closed'
                ? 'No products in this auction.'
                : 'No selected products for live auction yet.'}
            </p>
          ) : (
            <div className="-mx-6 overflow-x-auto px-6 pb-2 scroll-smooth lg:-mx-0 lg:px-0">
              <div className="flex gap-4">
                {displayedProducts.map((ap) => {
                const voteCount = stats?.voteCountsByProduct[ap.productId] ?? 0
                const participationCounts = stats?.participationCounts.byProduct[ap.productId]
                const bidsInfo = stats?.bidsByProduct[ap.productId]
                const winnerConf = stats?.winnerConfirmationsByProduct[ap.productId]
                const isLive = liveProductId === ap.productId

                return (
                  <div key={ap.id} className="w-44 flex-shrink-0">
                    <AuctionProductCard
                    auctionProduct={ap}
                    product={productMap.get(ap.productId) ?? null}
                    showVoteCount={
                      auction.progress === 'voting_open' || auction.progress === 'voting_closed'
                    }
                    voteCount={voteCount}
                    showSelectedBadge={auction.progress === 'voting_closed'}
                    participationCounts={
                      auction.progress === 'participation_approval' && participationCounts
                        ? participationCounts
                        : undefined
                    }
                    highestBid={
                      (auction.progress === 'live_auction' ||
                        auction.progress === 'winner_confirmation' ||
                        auction.progress === 'fallback_resolution' ||
                        auction.status === 'completed')
                        ? bidsInfo?.highestAmount
                        : undefined
                    }
                    bidCount={
                      auction.progress === 'live_auction' ? bidsInfo?.count ?? 0 : undefined
                    }
                    winnerStatus={
                      (auction.progress === 'winner_confirmation' ||
                        auction.progress === 'fallback_resolution' ||
                        auction.status === 'completed') &&
                      winnerConf
                        ? winnerConf.status
                        : undefined
                    }
                    isLive={isLive}
                    compact
                  />
                  </div>
                )
              })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {statsLoading && !stats ? (
            <p className="text-slate-600 dark:text-slate-400">Loading auction data...</p>
          ) : (
            <AuctionDetailsSidebar
              auction={auction}
              stats={stats ?? null}
              categoryCount={categoryCount}
              displayedProductCount={displayedProducts.length}
            />
          )}
        </div>
      </div>
    </div>
  )
}
