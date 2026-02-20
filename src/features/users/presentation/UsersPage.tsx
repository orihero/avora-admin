import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/core/components'
import usersImage from '@/features/auction/assets/users.svg'

export function UsersPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-6">
      <PageHeader
        title={t('pages.users')}
        breadcrumbItems={[
          { label: t('pages.breadcrumbData'), path: '/' },
          { label: t('pages.breadcrumbUsers') },
        ]}
        illustrationSrc={usersImage}
        illustrationAlt={t('pages.usersIllustrationAlt')}
      />
      {/* UsersTable will be added in presentation step */}
    </div>
  )
}
