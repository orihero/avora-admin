import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/core/components'
import { AuctionsTable } from './components/AuctionsTable'
import chartImage from '../assets/chart.svg'

export function AuctionPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-6">
      <PageHeader
        title={t('pages.auctions')}
        breadcrumbItems={[
          { label: t('pages.breadcrumbData'), path: '/' },
          { label: t('pages.breadcrumbAuctions') },
        ]}
        illustrationSrc={chartImage}
        illustrationAlt={t('pages.auctionsIllustrationAlt')}
      />
      <AuctionsTable />
    </div>
  )
}
