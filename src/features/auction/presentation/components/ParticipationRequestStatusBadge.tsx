import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import type { ParticipationRequestStatus } from '@/features/auction/domain/entities'

const statusConfig: Record<
  ParticipationRequestStatus,
  { label: string; className: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    icon: 'material-symbols:schedule',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    icon: 'material-symbols:check-circle-outline',
  },
  declined: {
    label: 'Declined',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    icon: 'material-symbols:cancel',
  },
}

interface ParticipationRequestStatusBadgeProps {
  status: ParticipationRequestStatus
  className?: string
}

export function ParticipationRequestStatusBadge({
  status,
  className,
}: ParticipationRequestStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    icon: 'material-symbols:help-outline',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon icon={config.icon} className="h-3.5 w-3.5" />
      {config.label}
    </span>
  )
}
