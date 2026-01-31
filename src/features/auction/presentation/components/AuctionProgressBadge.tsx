import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import type { AuctionProgress } from '@/features/auction/domain/entities'

const progressConfig: Record<
  AuctionProgress,
  { label: string; className: string; icon: string }
> = {
  voting_open: {
    label: 'Voting Open',
    className: 'bg-amber-100 text-amber-800',
    icon: 'material-symbols:how-to-vote-outline',
  },
  voting_closed: {
    label: 'Voting Closed',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-200',
    icon: 'material-symbols:lock-outline',
  },
  participation_approval: {
    label: 'Participation Approval',
    className: 'bg-blue-100 text-blue-800',
    icon: 'material-symbols:person-search',
  },
  live_auction: {
    label: 'Live Auction',
    className: 'bg-emerald-100 text-emerald-800',
    icon: 'material-symbols:gavel',
  },
  winner_confirmation: {
    label: 'Winner Confirmation',
    className: 'bg-violet-100 text-violet-800',
    icon: 'material-symbols:emoji-events-outline',
  },
  fallback_resolution: {
    label: 'Fallback Resolution',
    className: 'bg-orange-100 text-orange-800',
    icon: 'material-symbols:swap-horiz',
  },
}

interface AuctionProgressBadgeProps {
  progress: AuctionProgress
  className?: string
}

export function AuctionProgressBadge({ progress, className }: AuctionProgressBadgeProps) {
  const config = progressConfig[progress] ?? {
    label: progress.replace(/_/g, ' '),
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
