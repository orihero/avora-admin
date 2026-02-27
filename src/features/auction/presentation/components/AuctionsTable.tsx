import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Icon } from '@iconify/react'
import { useAuctions, useDeleteAuction } from '../hooks'
import { AuctionStatusBadge } from './AuctionStatusBadge'
import { AuctionProgressBadge } from './AuctionProgressBadge'
import { CreateAuctionDrawer } from './CreateAuctionDrawer'
import { EditAuctionDrawer } from './EditAuctionDrawer'
import { DeleteAuctionModal } from './DeleteAuctionModal'
import type { Auction, AuctionStatus, AuctionProgress } from '@/features/auction/domain/entities'
import { EmptyState } from '@/core/components'
import { formatDateTime } from '@/core/utils'

const STATUS_OPTIONS: { value: '' | AuctionStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const PROGRESS_OPTIONS: { value: '' | AuctionProgress; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'voting_open', label: 'Voting Open' },
  { value: 'voting_closed', label: 'Voting Closed' },
  { value: 'participation_approval', label: 'Participation Approval' },
  { value: 'live_auction', label: 'Live Auction' },
  { value: 'winner_confirmation', label: 'Winner Confirmation' },
  { value: 'fallback_resolution', label: 'Fallback Resolution' },
]

const ORDER_BY_OPTIONS: { value: string; label: string }[] = [
  { value: 'startAt', label: 'Start' },
  { value: 'votingEndAt', label: 'Voting end' },
  { value: 'liveAuctionStartAt', label: 'Live auction start' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
  { value: 'progress', label: 'Progress' },
]

const columnHelper = createColumnHelper<Auction>()

export function AuctionsTable() {
  const navigate = useNavigate()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [titleSearch, setTitleSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | AuctionStatus>('')
  const [progressFilter, setProgressFilter] = useState<'' | AuctionProgress>('')
  const [orderBy, setOrderBy] = useState('startAt')
  const [orderDesc, setOrderDesc] = useState(true)
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false)
  const [editAuction, setEditAuction] = useState<Auction | null>(null)
  const [deleteAuction, setDeleteAuction] = useState<Auction | null>(null)

  const { data, isLoading, isError, error, refetch } = useAuctions({
    limit: pageSize,
    offset: pageIndex * pageSize,
    titleSearch: titleSearch.trim() || undefined,
    status: statusFilter || undefined,
    progress: progressFilter || undefined,
    orderBy,
    orderDesc,
  })

  const deleteAuctionMutation = useDeleteAuction()

  const handleDeleteConfirm = () => {
    if (!deleteAuction) return
    deleteAuctionMutation.mutate(deleteAuction.id, {
      onSuccess: () => setDeleteAuction(null),
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <AuctionStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('progress', {
        header: 'Progress',
        cell: (info) => <AuctionProgressBadge progress={info.getValue()} />,
      }),
      columnHelper.accessor('startAt', {
        header: 'Start',
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('votingEndAt', {
        header: 'Voting end',
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('liveAuctionStartAt', {
        header: 'Live auction start',
        cell: (info) => {
          const value = info.getValue()
          return (
            <span className="text-slate-700 dark:text-slate-300">
              {value ? formatDateTime(value) : '—'}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setEditAuction(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              aria-label="Edit"
            >
              <Icon icon="material-symbols:edit" className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleteAuction(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-700 dark:text-red-300 dark:hover:bg-red-900/30"
              aria-label="Delete"
            >
              <Icon icon="material-symbols:delete" className="h-4 w-4" />
              Delete
            </button>
          </div>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data: data?.auctions ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.total != null ? Math.ceil(data.total / pageSize) : 0,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater
      setPageIndex(next.pageIndex)
      setPageSize(next.pageSize)
    },
  })

  const total = data?.total ?? 0
  const totalPages = data?.total != null ? Math.ceil(data.total / pageSize) : 0
  const canPrev = pageIndex > 0
  const canNext = pageIndex < totalPages - 1

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-medium">Failed to load auctions</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Auctions</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const rows = data?.auctions ?? []
              if (rows.length === 0) return
              const headers = ['Title', 'Status', 'Progress', 'Start', 'Voting end']
              const csvRows = [
                headers.join(','),
                ...rows.map((a) =>
                  [
                    `"${(a.title ?? '').replace(/"/g, '""')}"`,
                    a.status,
                    a.progress,
                    formatDateTime(a.startAt),
                    formatDateTime(a.votingEndAt),
                  ].join(',')
                ),
              ]
              const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `auctions-${new Date().toISOString().slice(0, 10)}.csv`
              a.click()
              URL.revokeObjectURL(url)
            }}
            disabled={!data?.auctions?.length}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            title="Download as CSV"
          >
            <Icon icon="material-symbols:download" className="h-5 w-5" />
            Download
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            <Icon icon="material-symbols:refresh" className="h-5 w-5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setCreateDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <Icon icon="material-symbols:add" className="h-5 w-5" />
            Create auction
          </button>
        </div>
      </div>

      <CreateAuctionDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditAuctionDrawer
        open={!!editAuction}
        auction={editAuction}
        onClose={() => setEditAuction(null)}
        onSuccess={() => refetch()}
      />

      <DeleteAuctionModal
        open={!!deleteAuction}
        auction={deleteAuction}
        onClose={() => setDeleteAuction(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteAuctionMutation.isPending}
      />

      {/* Filter row */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Title
          </label>
          <input
            type="text"
            placeholder="Search..."
            value={titleSearch}
            onChange={(e) => {
              setTitleSearch(e.target.value)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as '' | AuctionStatus)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
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
            value={progressFilter}
            onChange={(e) => {
              setProgressFilter(e.target.value as '' | AuctionProgress)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            {PROGRESS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Sort by
          </label>
          <select
            value={orderBy}
            onChange={(e) => {
              setOrderBy(e.target.value)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            {ORDER_BY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Order
          </label>
          <select
            value={orderDesc ? 'desc' : 'asc'}
            onChange={(e) => {
              setOrderDesc(e.target.value === 'desc')
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-600 dark:text-slate-400">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="pb-3 pr-4 font-medium last:pr-0"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState title="Empty" />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/auction/${row.original.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/auction/${row.original.id}`)
                    }
                  }}
                  className="cursor-pointer border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 pr-4 last:pr-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {total} {total === 1 ? 'row' : 'rows'}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {pageIndex + 1} of {totalPages || 1}
          </span>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPageIndex(0)
              }}
              className="rounded border border-slate-200 px-2 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            >
              {[10, 15, 25].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPageIndex(0)}
            disabled={!canPrev}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-600"
            aria-label="First page"
          >
            <Icon icon="material-symbols:first-page" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-600"
            aria-label="Previous page"
          >
            <Icon icon="material-symbols:chevron-left" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            disabled={!canNext}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-600"
            aria-label="Next page"
          >
            <Icon icon="material-symbols:chevron-right" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={!canNext}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-600"
            aria-label="Last page"
          >
            <Icon icon="material-symbols:last-page" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
