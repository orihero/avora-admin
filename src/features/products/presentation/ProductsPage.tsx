import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/core/components'
import { ProductsTable } from './components/ProductsTable'
import productsImage from '../assets/products.svg'

export function ProductsPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-6">
      <PageHeader
        title={t('pages.products')}
        breadcrumbItems={[
          { label: t('pages.breadcrumbData'), path: '/' },
          { label: t('pages.breadcrumbProducts') },
        ]}
        illustrationSrc={productsImage}
        illustrationAlt={t('pages.productsIllustrationAlt')}
      />
      <ProductsTable />
    </div>
  )
}
