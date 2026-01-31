import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/core/components'
import { VariablesTable } from './components/VariablesTable'

export function SystemConfigurationsPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-white p-6 dark:bg-slate-900">
      <PageHeader
        title={t('pages.systemConfigurations')}
        breadcrumbItems={[
          { label: t('pages.breadcrumbSettings'), path: '/' },
          { label: t('pages.breadcrumbSystemConfigurations') },
        ]}
      />
      <VariablesTable />
    </div>
  )
}
