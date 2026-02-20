import { useTranslation } from 'react-i18next'
import { cn } from '@/core/components'
import type { UserProfileRole } from '@/features/users/domain/entities'

export interface UserRoleBadgeProps {
  role: UserProfileRole
  className?: string
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const { t } = useTranslation()
  const label = role === 'admin' ? t('pages.usersRoleAdmin') : t('pages.usersRoleUser')
  const isAdmin = role === 'admin'

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
        isAdmin
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
        className
      )}
    >
      {label}
    </span>
  )
}
