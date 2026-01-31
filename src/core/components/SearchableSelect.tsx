import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from './cn'

export interface SearchableSelectItem {
  id: string
  label: string
}

export interface SearchableSelectProps {
  items: SearchableSelectItem[]
  value: string | null
  onSelect: (id: string) => void
  createNewOption?: { label: string }
  onCreateNew?: () => void
  loading?: boolean
  placeholder?: string
  emptyMessage?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Ref to the trigger element so dropdown positions below it */
  anchorRef?: React.RefObject<HTMLElement | null>
}

export function SearchableSelect({
  items,
  onSelect,
  createNewOption,
  onCreateNew,
  loading = false,
  placeholder = 'Search...',
  emptyMessage = 'No items found',
  open,
  onOpenChange,
  anchorRef,
}: SearchableSelectProps) {
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items
    const q = search.trim().toLowerCase()
    return items.filter((item) => item.label.toLowerCase().includes(q))
  }, [items, search])

  useEffect(() => {
    if (open) setSearch('')
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const el = containerRef.current
      const anchor = anchorRef?.current
      if (
        el &&
        !el.contains(e.target as Node) &&
        anchor &&
        !anchor.contains(e.target as Node)
      ) {
        onOpenChange(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange, anchorRef])

  if (!open) return null

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800"
      role="listbox"
    >
      <div className="border-b border-slate-200 p-2 dark:border-slate-600">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
          autoFocus
          aria-label="Search"
        />
      </div>
      <div className="max-h-60 overflow-y-auto p-1">
        {createNewOption && onCreateNew && (
          <button
            type="button"
            onClick={() => {
              onCreateNew()
              onOpenChange(false)
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium',
              'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50'
            )}
            role="option"
          >
            <Icon icon="material-symbols:add" className="h-5 w-5 shrink-0" />
            {createNewOption.label}
          </button>
        )}
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
            <Icon icon="material-symbols:progress-activity" className="h-5 w-5 animate-spin" />
            Loading...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
            {emptyMessage}
          </div>
        ) : (
          <ul className="space-y-0.5">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.id)
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  role="option"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
