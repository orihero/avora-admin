import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { useUsers, useDeleteUserProfile } from '../hooks'
import { UserRoleBadge } from './UserRoleBadge'
import { DeleteUserModal } from './DeleteUserModal'
import type { UserProfile, UserProfileRole } from '@/features/users/domain/entities'
import { EmptyState } from '@/core/components'
import { formatDateTime, formatDate } from '@/core/utils'

const ROLE_OPTIONS: { value: '' | UserProfileRole; labelKey: string }[] = [
  { value: '', labelKey: 'pages.usersFilterRoleAll' },
  { value: 'admin', labelKey: 'pages.usersRoleAdmin' },
  { value: 'user', labelKey: 'pages.usersRoleUser' },
]

const ORDER_BY_OPTIONS: { value: string; labelKey: string }[] = [
  { value: '$createdAt', labelKey: 'pages.usersCreatedAt' },
  { value: 'firstName', labelKey: 'pages.usersFirstName' },
  { value: 'role', labelKey: 'pages.usersRole' },
]

function getDisplayName(user: UserProfile): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  return name || user.phoneNumber || user.authId || '—'
}

const columnHelper = createColumnHelper<UserProfile>()

export function UsersTable() {
  const { t } = useTranslation()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'' | UserProfileRole>('')
  const [orderBy, setOrderBy] = useState('$createdAt')
  const [orderDesc, setOrderDesc] = useState(true)
  const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null)

  const { data, isLoading, isError, error, refetch } = useUsers({
    limit: pageSize,
    offset: pageIndex * pageSize,
    search: search.trim() || undefined,
    role: roleFilter || undefined,
    orderBy,
    orderDesc,
  })

  const deleteUserMutation = useDeleteUserProfile()

  const handleDeleteConfirm = () => {
    if (!deleteUser) return
    deleteUserMutation.mutate(deleteUser.id, {
      onSuccess: () => {
        setDeleteUser(null)
        refetch()
      },
    })
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'avatar',
        header: '',
        cell: ({ row }) => {
          const url = row.original.avatarUrl
          return (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
              {url ? (
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <Icon icon="material-symbols:person" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              )}
            </div>
          )
        },
      }),
      columnHelper.display({
        id: 'name',
        header: () => t('pages.usersName'),
        cell: ({ row }) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {getDisplayName(row.original)}
          </span>
        ),
      }),
      columnHelper.accessor('phoneNumber', {
        header: () => t('pages.usersPhoneNumber'),
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">
            {info.getValue() ?? '—'}
          </span>
        ),
      }),
      columnHelper.accessor('role', {
        header: () => t('pages.usersRole'),
        cell: (info) => <UserRoleBadge role={info.getValue()} />,
      }),
      columnHelper.accessor('dateOfBirth', {
        header: () => t('pages.usersDateOfBirth'),
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: () => t('pages.usersCreatedAt'),
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">
            {formatDateTime(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => t('pages.usersActions'),
        cell: ({ row }) => (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setDeleteUser(row.original)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-700 dark:text-red-300 dark:hover:bg-red-900/30"
              aria-label={t('pages.usersDelete')}
            >
              <Icon icon="material-symbols:delete" className="h-4 w-4" />
              {t('pages.usersDelete')}
            </button>
          </div>
        ),
      }),
    ],
    [t]
  )

  const table = useReactTable({
    data: data?.userProfiles ?? [],
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
        <p className="font-medium">{t('pages.usersLoadError')}</p>
        <p className="text-sm">{error?.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
        >
          {t('pages.usersRefresh')}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t('pages.users')}
        </h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <Icon icon="material-symbols:refresh" className="h-5 w-5" />
          {t('pages.usersRefresh')}
        </button>
      </div>

      <DeleteUserModal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
        user={deleteUser}
        isDeleting={deleteUserMutation.isPending}
      />

      {/* Filter row */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('pages.usersSearch')}
          </label>
          <input
            type="text"
            placeholder={t('pages.usersSearchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('pages.usersFilterRole')}
          </label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as '' | UserProfileRole)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('pages.usersSortBy')}
          </label>
          <select
            value={orderBy}
            onChange={(e) => {
              setOrderBy(e.target.value)
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            {ORDER_BY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('pages.usersOrder')}
          </label>
          <select
            value={orderDesc ? 'desc' : 'asc'}
            onChange={(e) => {
              setOrderDesc(e.target.value === 'desc')
              setPageIndex(0)
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="desc">{t('pages.usersOrderDesc')}</option>
            <option value="asc">{t('pages.usersOrderAsc')}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-600 dark:text-slate-400"
              >
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
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  {t('pages.usersLoading')}
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState
                    title={t('pages.usersEmpty')}
                    description={t('pages.usersEmptyDescription')}
                  />
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
            {total} {total === 1 ? t('pages.usersRow') : t('pages.usersRows')}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {t('pages.usersPageOf', { current: pageIndex + 1, total: totalPages || 1 })}
          </span>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            {t('pages.usersRowsPerPage')}
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
            aria-label={t('pages.usersFirstPage')}
          >
            <Icon icon="material-symbols:first-page" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-600"
            aria-label={t('pages.usersPrevPage')}
          >
            <Icon icon="material-symbols:chevron-left" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
            disabled={!canNext}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-600"
            aria-label={t('pages.usersNextPage')}
          >
            <Icon icon="material-symbols:chevron-right" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={!canNext}
            className="rounded p-2 text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-slate-600"
            aria-label={t('pages.usersLastPage')}
          >
            <Icon icon="material-symbols:last-page" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
