import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks'
import type { Product } from '@/features/products/domain/entities'
import { EmptyState } from '@/core/components'
import { formatDateTime } from '@/core/utils'

function formatPrice(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

const columnHelper = createColumnHelper<Product>()

export function ProductsTable() {
  const { t } = useTranslation()
  const { data, isLoading, isError, error, refetch } = useProducts()

  const columns = [
    columnHelper.accessor('imageUrl', {
      header: t('pages.productsTableColumnImage'),
      cell: (info) => (
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
          <img
            src={info.getValue()}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = ''
              e.currentTarget.className = 'h-full w-full bg-slate-200 dark:bg-slate-600'
            }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('name', {
      header: t('pages.productsTableColumnName'),
      cell: (info) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('brand', {
      header: t('pages.productsTableColumnBrand'),
      cell: (info) => (
        <span className="text-slate-700 dark:text-slate-300">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('price', {
      header: t('pages.productsTableColumnPrice'),
      cell: (info) => (
        <span className="text-slate-700 dark:text-slate-300">{formatPrice(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('backgroundColorHex', {
      header: t('pages.productsTableColumnBackground'),
      cell: (info) => {
        const hex = info.getValue()
        if (!hex) return <span className="text-slate-500">—</span>
        return (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-5 w-5 rounded border border-slate-200 dark:border-slate-600"
              style={{ backgroundColor: hex }}
              title={hex}
            />
            <span className="text-slate-700 dark:text-slate-300">{hex}</span>
          </span>
        )
      },
    }),
    columnHelper.accessor('categoryId', {
      header: t('pages.productsTableColumnCategory'),
      cell: (info) => (
        <span className="text-slate-700 dark:text-slate-300">
          {info.getValue() ?? '—'}
        </span>
      ),
    }),
    columnHelper.accessor('auctionRelated', {
      header: t('pages.productsTableColumnAuctionRelated'),
      cell: (info) => (
        <span
          className={
            info.getValue()
              ? 'inline-flex rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-200'
              : 'text-slate-500 dark:text-slate-400'
          }
        >
          {info.getValue() ? t('pages.productsTableYes') : t('pages.productsTableNo')}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: t('pages.productsTableColumnCreated'),
      cell: (info) => (
        <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: t('pages.productsTableColumnUpdated'),
      cell: (info) => (
        <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
      ),
    }),
  ]

  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
        <p className="font-medium">{t('pages.productsTableLoadError')}</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('pages.productsTableTitle')}</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <Icon icon="material-symbols:refresh" className="h-5 w-5" />
          {t('pages.productsTableRefresh')}
        </button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-slate-600 dark:text-slate-400">{t('pages.productsTableLoading')}</p>
      ) : (data?.products?.length ?? 0) === 0 ? (
        <EmptyState
          title={t('pages.productsTableEmptyTitle')}
          description={t('pages.productsTableEmptyDescription')}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
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
