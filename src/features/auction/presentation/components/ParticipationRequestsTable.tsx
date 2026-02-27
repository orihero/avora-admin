import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Icon } from '@iconify/react'
import { useParticipationRequests, useUpdateParticipationRequestStatus } from '../hooks'
import { ParticipationRequestStatusBadge } from './ParticipationRequestStatusBadge'
import type {
  ParticipationRequest,
  ParticipationRequestStatus,
} from '@/features/auction/domain/entities'
import { EmptyState } from '@/core/components'
import { formatDateTime } from '@/core/utils'
import { useAuthStore } from '@/features/auth/presentation/stores'

const STATUS_OPTIONS: { value: '' | ParticipationRequestStatus; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
]

const ORDER_BY_OPTIONS: { value: string; label: string }[] = [
  { value: '$createdAt', label: 'Created' },
  { value: 'reviewedAt', label: 'Reviewed at' },
  { value: 'status', label: 'Status' },
]

const columnHelper = createColumnHelper<ParticipationRequest>()

interface ParticipationRequestsTableProps {
  auctionId: string
}

export function ParticipationRequestsTable({ auctionId }: ParticipationRequestsTableProps) {
  const profile = useAuthStore((s) => s.profile)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<'' | ParticipationRequestStatus>('')
  const [orderBy, setOrderBy] = useState('$createdAt')
  const [orderDesc, setOrderDesc] = useState(true)

  const { data, isLoading, isError, error, refetch } = useParticipationRequests(auctionId, {
    limit: pageSize,
    offset: pageIndex * pageSize,
    status: statusFilter || undefined,
    orderBy,
    orderDesc,
  })

  const updateStatusMutation = useUpdateParticipationRequestStatus(auctionId)

  const handleAccept = (row: ParticipationRequest) => {
    if (!profile?.id || row.status !== 'pending') return
    updateStatusMutation.mutate({
      id: row.id,
      status: 'approved',
      reviewedByProfileId: profile.id,
    })
  }

  const handleReject = (row: ParticipationRequest) => {
    if (!profile?.id || row.status !== 'pending') return
    updateStatusMutation.mutate({
      id: row.id,
      status: 'declined',
      reviewedByProfileId: profile.id,
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.userDisplayName ?? row.userProfileId, {
        id: 'user',
        header: 'User',
        cell: (info) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {info.row.original.userDisplayName ?? info.row.original.userProfileId ?? '—'}
          </span>
        ),
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Phone',
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <ParticipationRequestStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('reviewedAt', {
        header: 'Reviewed at',
        cell: (info) => {
          const v = info.getValue()
          return (
            <span className="text-slate-700 dark:text-slate-300">
              {v ? formatDateTime(v) : '—'}
            </span>
          )
        },
      }),
      columnHelper.accessor((row) => row.reviewedByDisplayName ?? row.reviewedByProfileId, {
        id: 'reviewedBy',
        header: 'Reviewed by',
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">
            {info.row.original.reviewedByDisplayName ??
              info.row.original.reviewedByProfileId ??
              '—'}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const req = row.original
          if (req.status !== 'pending') {
            return <span className="text-slate-400 text-xs">—</span>
          }
          return (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => handleAccept(req)}
                disabled={!profile?.id || updateStatusMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-700 dark:text-emerald-300 dark:hover:bg-emerald-900/30 disabled:opacity-50"
                aria-label="Accept"
              >
                <Icon icon="material-symbols:check" className="h-4 w-4" />
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleReject(req)}
                disabled={!profile?.id || updateStatusMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-700 dark:text-red-300 dark:hover:bg-red-900/30 disabled:opacity-50"
                aria-label="Reject"
              >
                <Icon icon="material-symbols:close" className="h-4 w-4" />
                Reject
              </button>
            </div>
          )
        },
      }),
    ],
    [profile?.id, updateStatusMutation.isPending]
  )

  const table = useReactTable({
    data: data?.requests ?? [],
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
        <p className="font-medium">Failed to load participation requests</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Participation requests
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            <Icon icon="material-symbols:refresh" className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as '' | ParticipationRequestStatus)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
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
              <tr
                key={headerGroup.id}
                className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-600 dark:text-slate-400"
              >
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="pb-3 pr-4 font-medium last:pr-0">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-500 dark:text-slate-400"
                >
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
                  className="border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
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
