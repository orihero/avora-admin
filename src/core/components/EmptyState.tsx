import type { ReactNode } from 'react'
import { cn } from './cn'
import emptyListSvg from '../assets/empty-list.svg'

export interface EmptyStateProps {
  /** Main heading (e.g. "Empty", "No results") */
  title?: string
  /** Optional supporting text below the title */
  description?: string
  /** Custom illustration src; when omitted, uses the default empty-list illustration */
  illustration?: string
  /** Optional actions (e.g. "Create" button) */
  children?: ReactNode
  /** Optional class for the wrapper */
  className?: string
}

export function EmptyState({
  title = 'Empty',
  description,
  illustration = emptyListSvg,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[320px] flex-col items-center justify-center gap-4 py-12',
        className
      )}
    >
      <img
        src={illustration}
        alt=""
        className="h-48 w-auto max-w-[280px] object-contain opacity-90 dark:opacity-80"
      />
      <p className="text-xl font-bold text-slate-700 dark:text-slate-200 sm:text-2xl">
        {title}
      </p>
      {description && (
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}
