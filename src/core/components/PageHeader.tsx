import { Link } from 'react-router-dom'
import { cn } from './cn'

export interface PageHeaderProps {
  title: string
  /** Breadcrumb segments; last item is current page (not linked). */
  breadcrumbItems: { label: string; path?: string }[]
  /** Optional image URL shown on the right (e.g. in a light blue card layout). */
  illustrationSrc?: string
  illustrationAlt?: string
  className?: string
}

export function PageHeader({
  title,
  breadcrumbItems,
  illustrationSrc,
  illustrationAlt = '',
  className,
}: PageHeaderProps) {
  const content = (
    <>
      <nav className="mb-2 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400" aria-label="Breadcrumb">
        {breadcrumbItems.map((item, i) => {
          const isLast = i === breadcrumbItems.length - 1
          return (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-slate-400 dark:text-slate-500" aria-hidden>
                  •
                </span>
              )}
              {isLast || !item.path ? (
                <span className={isLast ? 'font-medium text-slate-900 dark:text-slate-100' : ''}>{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="transition-colors hover:text-slate-900 dark:hover:text-slate-100"
                >
                  {item.label}
                </Link>
              )}
            </span>
          )
        })}
      </nav>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
    </>
  )

  if (illustrationSrc) {
    return (
      <div
        className={cn(
          'relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 via-sky-50/95 to-white px-6 py-6 shadow-sm dark:from-slate-800 dark:via-slate-800 dark:to-slate-900',
          className
        )}
      >
        <div className="flex min-h-[100px] items-center justify-between gap-6">
          <div className="flex-1">{content}</div>
          <div className="flex flex-shrink-0 items-center justify-end">
            <img
              src={illustrationSrc}
              alt={illustrationAlt}
              className="h-24 w-auto object-contain object-right md:h-28 lg:h-32"
            />
          </div>
        </div>
      </div>
    )
  }

  return <div className={cn('mb-6', className)}>{content}</div>
}
