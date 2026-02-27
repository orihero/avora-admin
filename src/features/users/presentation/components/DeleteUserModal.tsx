import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import type { UserProfile } from '@/features/users/domain/entities'

export interface DeleteUserModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  user: UserProfile | null
  isDeleting?: boolean
}

export function DeleteUserModal({
  open,
  onClose,
  onConfirm,
  user,
  isDeleting = false,
}: DeleteUserModalProps) {
  const { t } = useTranslation()
  if (!open || !user) return null

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.phoneNumber ||
    user.authId

  return (
    <>
      <div
        role="presentation"
        className="fixed inset-0 z-40 bg-slate-900/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-modal-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <h2
          id="delete-user-modal-title"
          className="text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          {t('pages.usersDeleteUser')}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {t('pages.usersDeleteConfirm')} &quot;{displayName}&quot;?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className={cn(
              'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium',
              'text-slate-700 transition-colors hover:bg-slate-50',
              'dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
              'disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            {t('pages.usersCancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white',
              'bg-red-600 transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
              'disabled:opacity-50 disabled:pointer-events-none'
            )}
          >
            {isDeleting ? (
              <>
                <Icon icon="material-symbols:progress-activity" className="h-5 w-5 animate-spin" />
                {t('pages.usersDeleting')}
              </>
            ) : (
              <>
                <Icon icon="material-symbols:delete" className="h-5 w-5" />
                {t('pages.usersDeleteButton')}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
