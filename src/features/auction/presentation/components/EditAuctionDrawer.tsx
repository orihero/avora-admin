import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import { useUpdateAuction } from '../hooks'
import type { Auction, AuctionStatus, AuctionProgress } from '@/features/auction/domain/entities'
import type { UpdateAuctionParams } from '@/features/auction/domain/repositories'

const inputBase =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500'

const STATUS_OPTIONS: { value: AuctionStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PROGRESS_OPTIONS: { value: AuctionProgress; label: string }[] = [
  { value: 'voting_open', label: 'Voting Open' },
  { value: 'voting_closed', label: 'Voting Closed' },
  { value: 'participation_approval', label: 'Participation Approval' },
  { value: 'live_auction', label: 'Live Auction' },
  { value: 'winner_confirmation', label: 'Winner Confirmation' },
  { value: 'fallback_resolution', label: 'Fallback Resolution' },
]

function toISO(localDateTime: string): string {
  if (!localDateTime) return ''
  return new Date(localDateTime).toISOString()
}

function toLocalDateTime(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ''
  }
}

export interface EditAuctionDrawerProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  auction: Auction | null
}

function formStateFromAuction(auction: Auction | null) {
  if (!auction) {
    return {
      title: '',
      description: '',
      startAt: '',
      votingEndAt: '',
      status: 'draft' as AuctionStatus,
      progress: 'voting_open' as AuctionProgress,
    }
  }
  return {
    title: auction.title,
    description: auction.description ?? '',
    startAt: toLocalDateTime(auction.startAt),
    votingEndAt: toLocalDateTime(auction.votingEndAt),
    status: auction.status,
    progress: auction.progress,
  }
}

export function EditAuctionDrawer({
  open,
  onClose,
  onSuccess,
  auction,
}: EditAuctionDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState(() => formStateFromAuction(null))
  const [validationError, setValidationError] = useState<string | null>(null)

  const updateAuction = useUpdateAuction()

  useEffect(() => {
    if (open && auction) {
      document.body.style.overflow = 'hidden'
      setForm(formStateFromAuction(auction))
      setValidationError(null)
      updateAuction.reset()
      const t = requestAnimationFrame(() => setMounted(true))
      return () => {
        cancelAnimationFrame(t)
        document.body.style.overflow = ''
      }
    }
    if (!open) {
      setMounted(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, auction?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!auction) return
    setValidationError(null)

    const title = form.title.trim()
    if (!title) {
      setValidationError('Title is required.')
      return
    }

    const startAt = toISO(form.startAt)
    const votingEndAt = toISO(form.votingEndAt)
    if (new Date(votingEndAt) <= new Date(startAt)) {
      setValidationError('Voting end must be after start.')
      return
    }

    const params: UpdateAuctionParams = {
      title,
      description: form.description.trim() || null,
      startAt,
      votingEndAt,
      status: form.status,
      progress: form.progress,
    }

    updateAuction.mutate(
      { id: auction.id, params },
      {
        onSuccess: () => {
          onClose()
          onSuccess?.()
        },
      }
    )
  }

  if (!open || !auction) return null

  const errorMessage = validationError ?? updateAuction.error?.message ?? null

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/50 transition-opacity duration-200',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer panel from right */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-auction-drawer-title"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[40vw] flex-col',
          'bg-white shadow-xl dark:bg-slate-800',
          'transform transition-transform duration-200 ease-out',
          mounted ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2
            id="edit-auction-drawer-title"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            Edit auction
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <Icon icon="material-symbols:close" className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200"
              >
                {errorMessage}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Auction title"
                className={inputBase}
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
                className={cn(inputBase, 'resize-y')}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Start at <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm((f) => ({ ...f, startAt: e.target.value }))}
                className={inputBase}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Voting end at <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.votingEndAt}
                onChange={(e) => setForm((f) => ({ ...f, votingEndAt: e.target.value }))}
                className={inputBase}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as AuctionStatus }))}
                className={inputBase}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Progress
              </label>
              <select
                value={form.progress}
                onChange={(e) =>
                  setForm((f) => ({ ...f, progress: e.target.value as AuctionProgress }))
                }
                className={inputBase}
              >
                {PROGRESS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-auto flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateAuction.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {updateAuction.isPending ? (
                  <>
                    <Icon icon="material-symbols:progress-activity" className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:save" className="h-5 w-5" />
                    Update auction
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
