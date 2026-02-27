import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { useCategories } from '../hooks'
import type { Category } from '@/features/categories/domain/entities'
import { EmptyState } from '@/core/components'
import { formatDateTime } from '@/core/utils'

const columnHelper = createColumnHelper<Category>()

export function CategoriesTable() {
  const { t } = useTranslation()
  const { data, isLoading, isError, error, refetch } = useCategories()

  const columns = [
    columnHelper.accessor('name', {
      header: t('pages.categoriesColumnName'),
      cell: (info) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: t('pages.categoriesColumnCreated'),
      cell: (info) => (
        <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: t('pages.categoriesColumnUpdated'),
      cell: (info) => (
        <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
      ),
    }),
  ]

  const table = useReactTable({
    data: data?.categories ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
        <p className="font-medium">{t('pages.categoriesLoadError')}</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('pages.categoriesTableTitle')}</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <Icon icon="material-symbols:refresh" className="h-5 w-5" />
          {t('pages.categoriesRefresh')}
        </button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-slate-600 dark:text-slate-400">{t('pages.categoriesLoading')}</p>
      ) : (data?.categories?.length ?? 0) === 0 ? (
        <EmptyState
          title={t('pages.categoriesEmptyTitle')}
          description={t('pages.categoriesEmptyDescription')}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-slate-200 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:border-slate-600 dark:text-slate-400"
                    >
                      {header.column.columnDef.header as string}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
