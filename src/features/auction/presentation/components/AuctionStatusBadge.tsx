import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import type { AuctionStatus } from '@/features/auction/domain/entities'

const statusConfig: Record<
  AuctionStatus,
  { label: string; className: string; icon: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    icon: 'material-symbols:edit-outline',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-100 text-blue-800',
    icon: 'material-symbols:schedule',
  },
  active: {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-800',
    icon: 'material-symbols:check-circle-outline',
  },
  completed: {
    label: 'Completed',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    icon: 'material-symbols:done-all',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800',
    icon: 'material-symbols:cancel',
  },
}

interface AuctionStatusBadgeProps {
  status: AuctionStatus
  className?: string
}

export function AuctionStatusBadge({ status, className }: AuctionStatusBadgeProps) {
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
