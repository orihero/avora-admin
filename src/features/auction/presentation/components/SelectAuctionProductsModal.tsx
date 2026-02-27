import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import type { Product } from '@/features/products/domain/entities'
import { useVariables } from '@/features/settings/presentation/hooks'
import {
  PRICE_INCREMENT_PRESETS_VARIABLE_KEY,
  parsePriceIncrementPresetsVariable,
} from '../utils/priceIncrementPresetsFromVariable'
import { CreateProductDrawer } from './CreateProductDrawer'
import type { AuctionProductRow } from './CreateAuctionDrawer'

const inputBase =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500'

export interface SelectAuctionProductsModalProps {
  open: boolean
  onClose: () => void
  products: Product[]
  selectedRows: AuctionProductRow[]
  onApply: (rows: AuctionProductRow[]) => void
  onProductCreated?: (productId: string, row: Omit<AuctionProductRow, 'productId'>) => void
  loading?: boolean
}

function productLabel(p: Product): string {
  return `${p.name} – ${p.brand} ($${p.price})`
}

export function SelectAuctionProductsModal({
  open,
  onClose,
  products,
  selectedRows,
  onApply,
  onProductCreated,
  loading = false,
}: SelectAuctionProductsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [createProductDrawerOpen, setCreateProductDrawerOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { data: variablesData } = useVariables()
  const variables = variablesData?.variables ?? []
  const defaultPresets = useMemo(() => {
    const v = variables.find(
      (x) => x.id === PRICE_INCREMENT_PRESETS_VARIABLE_KEY || x.attributes?.key === PRICE_INCREMENT_PRESETS_VARIABLE_KEY
    )
    const raw = v?.attributes?.value
    return parsePriceIncrementPresetsVariable(typeof raw === 'string' ? raw : undefined)
  }, [variables])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setSelectedIds(selectedRows.map((r) => r.productId))
      setSearch('')
      setMounted(false)
      const t = requestAnimationFrame(() => {
        setMounted(true)
        searchInputRef.current?.focus()
      })
      return () => {
        cancelAnimationFrame(t)
        setMounted(false)
        document.body.style.overflow = ''
      }
    }
    setMounted(false)
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, selectedRows])

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (createProductDrawerOpen) setCreateProductDrawerOpen(false)
        else onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, createProductDrawerOpen])

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const q = search.trim().toLowerCase()
    return products.filter((p) => productLabel(p).toLowerCase().includes(q))
  }, [products, search])

  const toggleProduct = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const handleApply = () => {
    const newRows: AuctionProductRow[] = selectedIds.map((id) => {
      const existing = selectedRows.find((r) => r.productId === id)
      return existing
        ? { ...existing }
        : {
            productId: id,
            minBidPrice: 0,
            selectedForLive: false,
            price_increment_presets: [...defaultPresets],
          }
    })
    onApply(newRows)
    onClose()
  }

  const handleCreateProductSuccess = (
    productId: string,
    auctionRow: { minBidPrice: number; selectedForLive: boolean; price_increment_presets: string[] }
  ) => {
    onProductCreated?.(productId, auctionRow)
    setSelectedIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
    setCreateProductDrawerOpen(false)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        className={cn(
          'fixed inset-0 z-[50] bg-slate-900/50 transition-opacity duration-200',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer panel from right */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-products-drawer-title"
        className={cn(
          'fixed inset-y-0 right-0 z-[60] flex w-[40vw] flex-col',
          'bg-white shadow-xl dark:bg-slate-800',
          'transform transition-transform duration-200 ease-out',
          mounted ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2
            id="select-products-drawer-title"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            Select products
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

        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4">
          <div className="border-b border-slate-200 pb-3 dark:border-slate-600">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className={inputBase}
              aria-label="Search products"
            />
          </div>

          <div className="mt-3 flex flex-col gap-2 py-1">
            <button
              type="button"
              onClick={() => setCreateProductDrawerOpen(true)}
              disabled={loading}
              className={cn(
                'inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium',
                'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50',
                'disabled:opacity-50'
              )}
            >
              <Icon icon="material-symbols:add" className="h-5 w-5 shrink-0" />
              Create new product
            </button>

            {loading ? (
              <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-slate-500 dark:text-slate-400">
                <Icon icon="material-symbols:progress-activity" className="h-5 w-5 animate-spin" />
                Loading...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No products found
              </div>
            ) : (
              <ul className="space-y-0.5">
                {filteredProducts.map((p) => (
                  <li key={p.id}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-slate-700 dark:text-slate-200">{productLabel(p)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium',
              'text-slate-700 transition-colors hover:bg-slate-50',
              'dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white',
              'bg-primary-600 transition-colors hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
            )}
          >
            Done
          </button>
        </div>
      </div>

      <CreateProductDrawer
        open={createProductDrawerOpen}
        onClose={() => setCreateProductDrawerOpen(false)}
        onSuccess={handleCreateProductSuccess}
        defaultPriceIncrementPresets={defaultPresets}
      />
    </>
  )
}
