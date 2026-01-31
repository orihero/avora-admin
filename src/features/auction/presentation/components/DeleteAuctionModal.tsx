import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import type { Auction } from '@/features/auction/domain/entities'

export interface DeleteAuctionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  auction: Auction | null
  isDeleting?: boolean
}

export function DeleteAuctionModal({
  open,
  onClose,
  onConfirm,
  auction,
  isDeleting = false,
}: DeleteAuctionModalProps) {
  if (!open || !auction) return null

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        className="fixed inset-0 z-40 bg-slate-900/50"
        onClick={onClose}
        aria-hidden
      />
      {/* Centered modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-auction-modal-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <h2
          id="delete-auction-modal-title"
          className="text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          Delete auction?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete &quot;{auction.title}&quot;? This cannot be undone.
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
            Cancel
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
                Deleting...
              </>
            ) : (
              <>
                <Icon icon="material-symbols:delete" className="h-5 w-5" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
