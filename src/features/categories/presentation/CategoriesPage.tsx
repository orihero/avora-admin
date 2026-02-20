import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/core/components'
import { CategoriesTable } from './components/CategoriesTable'
import categoriesImage from '../assets/categories.svg'

export function CategoriesPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-6">
      <PageHeader
        title={t('pages.categories')}
        breadcrumbItems={[
          { label: t('pages.breadcrumbData'), path: '/' },
          { label: t('pages.breadcrumbCategories') },
        ]}
        illustrationSrc={categoriesImage}
        illustrationAlt={t('pages.categoriesIllustrationAlt')}
      />
      <CategoriesTable />
    </div>
  )
}
