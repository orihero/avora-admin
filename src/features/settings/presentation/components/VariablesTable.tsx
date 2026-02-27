import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { Icon } from '@iconify/react'
import { useVariables } from '../hooks'
import type { Variable } from '@/features/settings/domain/entities'
import { formatDateTime } from '@/core/utils'

const COLUMN_HEADER_KEYS: Record<string, string> = {
  key: 'pages.variablesColumnKey',
  value: 'pages.variablesColumnValue',
  feature: 'pages.variablesColumnFeature',
  type: 'pages.variablesColumnType',
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function formatFeaturesValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (Array.isArray(value)) {
    if (value.length === 0) return '—'
    const names = value.map((item) => {
      if (typeof item === 'string') return item
      if (item !== null && typeof item === 'object' && 'name' in item && typeof (item as { name: unknown }).name === 'string') {
        return (item as { name: string }).name
      }
      return '—'
    })
    return names.filter(Boolean).join(', ')
  }
  if (typeof value === 'object' && value !== null && 'name' in value && typeof (value as { name: unknown }).name === 'string') {
    return (value as { name: string }).name
  }
  if (typeof value === 'object' && value !== null && 'features' in value && Array.isArray((value as { features: unknown }).features)) {
    return formatFeaturesValue((value as { features: unknown[] }).features)
  }
  return formatCellValue(value)
}

const columnHelper = createColumnHelper<Variable>()

const PREFERRED_ORDER = ['key', 'value', 'feature', 'type']
const HIDDEN_ATTRIBUTE_KEYS = ['$sequence', 'id']

export function VariablesTable() {
  const { t } = useTranslation()
  const { data, isLoading, isError, error, refetch } = useVariables()

  const variables = data?.variables ?? []
  const attributeKeys = useMemo(() => {
    const set = new Set<string>()
    for (const v of variables) {
      for (const key of Object.keys(v.attributes)) {
        if (!HIDDEN_ATTRIBUTE_KEYS.includes(key)) set.add(key)
      }
    }
    const ordered: string[] = []
    for (const key of PREFERRED_ORDER) {
      if (set.has(key)) ordered.push(key)
    }
    const rest = Array.from(set).filter((k) => !PREFERRED_ORDER.includes(k)).sort()
    return [...ordered, ...rest]
  }, [variables])

  const columns = useMemo(() => {
    const attributeColumns = attributeKeys.map((key) =>
      columnHelper.display({
        id: `attr_${key}`,
        header: COLUMN_HEADER_KEYS[key] ? t(COLUMN_HEADER_KEYS[key]) : key,
        cell: ({ row }) => (
          <span className="text-slate-700 dark:text-slate-300">
            {key === 'features' || key === 'feature'
              ? formatFeaturesValue(row.original.attributes[key])
              : formatCellValue(row.original.attributes[key])}
          </span>
        ),
      })
    )
    return [
      ...attributeColumns,
      columnHelper.accessor('createdAt', {
        header: t('pages.variablesCreatedAt'),
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('updatedAt', {
        header: t('pages.variablesUpdatedAt'),
        cell: (info) => (
          <span className="text-slate-700 dark:text-slate-300">{formatDateTime(info.getValue())}</span>
        ),
      }),
    ]
  }, [attributeKeys, t])

  const table = useReactTable({
    data: variables,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
        <p className="font-medium">{t('pages.variablesLoadError')}</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('pages.variablesTitle')}</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <Icon icon="material-symbols:refresh" className="h-5 w-5" />
          {t('pages.variablesRefresh')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-sm">
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
                  {t('pages.variablesLoading')}
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  {t('pages.variablesEmpty')}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-700"
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

      {!isLoading && variables.length > 0 && (
        <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
          {data?.total ?? variables.length} {data?.total === 1 ? t('pages.variablesRow') : t('pages.variablesRows')}
        </div>
      )}
    </div>
  )
}
