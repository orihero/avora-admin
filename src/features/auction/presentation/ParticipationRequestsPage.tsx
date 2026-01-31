import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/core/components'
import { useAuction } from './hooks'
import { ParticipationRequestsTable } from './components/ParticipationRequestsTable'
import chartImage from '../assets/chart.svg'

export function ParticipationRequestsPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { data: auction, isLoading: auctionLoading, isError: auctionError } = useAuction(id)

  if (!id) {
    return (
      <div className="min-h-screen bg-white p-6 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">{t('pages.auctionNotFound')}</p>
        <Link
          to="/auction"
          className="mt-2 inline-block text-primary-600 hover:underline dark:text-primary-400"
        >
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
        <Link
          to="/auction"
          className="mt-2 inline-block text-primary-600 hover:underline dark:text-primary-400"
        >
          {t('pages.breadcrumbAuctions')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-6">
      <PageHeader
        title={t('pages.participationRequests')}
        breadcrumbItems={[
          { label: t('pages.breadcrumbData'), path: '/' },
          { label: t('pages.breadcrumbAuctions'), path: '/auction' },
          { label: auction.title, path: `/auction/${auction.id}` },
          { label: t('pages.participationRequests') },
        ]}
        illustrationSrc={chartImage}
        illustrationAlt={t('pages.participationRequestsIllustrationAlt')}
      />
      <ParticipationRequestsTable auctionId={id} />
    </div>
  )
}
