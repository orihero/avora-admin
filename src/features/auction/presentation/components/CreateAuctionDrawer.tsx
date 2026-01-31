import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn, SearchableSelect } from '@/core/components'
import { useCreateAuctionWithProducts } from '../hooks'
import { useProducts } from '@/features/products'
import type { Product } from '@/features/products/domain/entities'
import type { AuctionStatus, AuctionProgress } from '@/features/auction/domain/entities'
import type { CreateAuctionParams } from '@/features/auction/domain/repositories'
import { CreateProductDrawer } from './CreateProductDrawer'

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

const defaultStart = () => toLocalDateTime(new Date().toISOString())
const defaultVotingEnd = () => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return toLocalDateTime(d.toISOString())
}

function AddPresetForm({
  onAdd,
}: {
  onAdd: (value: number, label: string) => void
}) {
  const [value, setValue] = useState('')
  const [label, setLabel] = useState('')
  const handleAdd = () => {
    const num = Number(value)
    if (Number.isNaN(num) || label.trim() === '') return
    onAdd(num, label.trim())
    setValue('')
    setLabel('')
  }
  return (
    <div className="flex flex-wrap items-end gap-2">
      <input
        type="number"
        min={0}
        step="0.01"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(inputBase, 'w-20')}
      />
      <input
        type="text"
        placeholder="Label (e.g. +$5)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className={cn(inputBase, 'min-w-0 flex-1')}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
      >
        Add preset
      </button>
    </div>
  )
}

export interface CreateAuctionDrawerProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export interface AuctionProductRow {
  productId: string
  minBidPrice: number
  selectedForLive: boolean
  price_increment_presets: string[]
}

function getInitialFormState(): {
  title: string
  description: string
  startAt: string
  votingEndAt: string
  status: AuctionStatus
  progress: AuctionProgress
  products: AuctionProductRow[]
} {
  return {
    title: '',
    description: '',
    startAt: defaultStart(),
    votingEndAt: defaultVotingEnd(),
    status: 'draft' as AuctionStatus,
    progress: 'voting_open' as AuctionProgress,
    products: [],
  }
}

export function CreateAuctionDrawer({ open, onClose, onSuccess }: CreateAuctionDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState(getInitialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [addProductDropdownOpen, setAddProductDropdownOpen] = useState(false)
  const [createProductDrawerOpen, setCreateProductDrawerOpen] = useState(false)
  const addProductAnchorRef = useRef<HTMLDivElement>(null)

  const createAuctionWithProducts = useCreateAuctionWithProducts()
  const { data: productsData, isLoading: productsLoading } = useProducts()
  const products = productsData?.products ?? []

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setForm(getInitialFormState())
      setValidationError(null)
      createAuctionWithProducts.reset()
      const t = requestAnimationFrame(() => setMounted(true))
      return () => {
        cancelAnimationFrame(t)
        document.body.style.overflow = ''
      }
    }
    setMounted(false)
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

    for (const row of form.products) {
      if (!row.productId.trim()) {
        setValidationError('Each product row must have a product selected.')
        return
      }
      if (row.minBidPrice < 0) {
        setValidationError('Min bid price must be >= 0.')
        return
      }
    }

    const auctionParams: CreateAuctionParams = {
      title,
      description: form.description.trim() || null,
      startAt,
      votingEndAt,
      status: form.status,
      progress: form.progress,
    }

    const productRows = form.products.map((row, index) => ({
      productId: row.productId,
      sortOrder: index,
      minBidPrice: row.minBidPrice,
      selectedForLive: row.selectedForLive,
      price_increment_presets: row.price_increment_presets,
    }))

    createAuctionWithProducts.mutate(
      { auction: auctionParams, products: productRows },
      {
        onSuccess: () => {
          onClose()
          onSuccess?.()
        },
      }
    )
  }

  const addProductRow = (productId: string, row: Omit<AuctionProductRow, 'productId'>) => {
    setForm((f) => ({
      ...f,
      products: [
        ...f.products,
        {
          productId,
          minBidPrice: row.minBidPrice,
          selectedForLive: row.selectedForLive,
          price_increment_presets: row.price_increment_presets,
        },
      ],
    }))
  }

  const handleSelectProduct = (productId: string) => {
    addProductRow(productId, {
      minBidPrice: 0,
      selectedForLive: false,
      price_increment_presets: [],
    })
    setAddProductDropdownOpen(false)
  }

  const handleCreateProductSuccess = (
    productId: string,
    auctionRow: {
      minBidPrice: number
      selectedForLive: boolean
      price_increment_presets: string[]
    }
  ) => {
    addProductRow(productId, auctionRow)
    setCreateProductDrawerOpen(false)
  }

  const removeProduct = (index: number) => {
    setForm((f) => ({
      ...f,
      products: f.products.filter((_, i) => i !== index),
    }))
  }

  const updateProduct = (index: number, patch: Partial<AuctionProductRow>) => {
    setForm((f) => ({
      ...f,
      products: f.products.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }))
  }

  const addPreset = (productIndex: number, value: number, label: string) => {
    const entry = `${value}:${label}`
    setForm((f) => ({
      ...f,
      products: f.products.map((row, i) =>
        i === productIndex
          ? { ...row, price_increment_presets: [...row.price_increment_presets, entry] }
          : row
      ),
    }))
  }

  const removePreset = (productIndex: number, presetIndex: number) => {
    setForm((f) => ({
      ...f,
      products: f.products.map((row, i) =>
        i === productIndex
          ? {
              ...row,
              price_increment_presets: row.price_increment_presets.filter((_, j) => j !== presetIndex),
            }
          : row
      ),
    }))
  }

  if (!open) return null

  const errorMessage =
    validationError ?? createAuctionWithProducts.error?.message ?? null

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
        aria-labelledby="create-auction-drawer-title"
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
            id="create-auction-drawer-title"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            Create auction
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

            {/* Auction products */}
            <div className="relative border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Auction products
                </h3>
                <div ref={addProductAnchorRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAddProductDropdownOpen(true)}
                    disabled={productsLoading}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
                  >
                    <Icon icon="material-symbols:add" className="h-4 w-4" />
                    Add product
                  </button>
                  <SearchableSelect
                    items={products.map((p: Product) => ({
                      id: p.id,
                      label: `${p.name} – ${p.brand} ($${p.price})`,
                    }))}
                    value={null}
                    onSelect={handleSelectProduct}
                    createNewOption={{ label: 'Create new product' }}
                    onCreateNew={() => {
                      setAddProductDropdownOpen(false)
                      setCreateProductDrawerOpen(true)
                    }}
                    loading={productsLoading}
                    placeholder="Search products..."
                    emptyMessage="No products found"
                    open={addProductDropdownOpen}
                    onOpenChange={setAddProductDropdownOpen}
                    anchorRef={addProductAnchorRef}
                  />
                </div>
              </div>
              {productsLoading && !addProductDropdownOpen && (
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading products...</p>
              )}
              <ul className="mt-2 space-y-3">
                {form.products.map((row, index) => (
                  <li
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-600 dark:bg-slate-700/30"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Product #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-600 dark:hover:text-slate-200"
                        aria-label="Remove product"
                      >
                        <Icon icon="material-symbols:close" className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-2">
                      <div>
                        <label className="mb-0.5 block text-xs text-slate-500 dark:text-slate-400">
                          Product
                        </label>
                        <select
                          value={row.productId}
                          onChange={(e) => updateProduct(index, { productId: e.target.value })}
                          className={inputBase}
                        >
                          <option value="">Select product</option>
                          {products.map((p: Product) => (
                            <option key={p.id} value={p.id}>
                              {p.name} – {p.brand} (${p.price})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-0.5 block text-xs text-slate-500 dark:text-slate-400">
                          Min bid price
                        </label>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={row.minBidPrice}
                          onChange={(e) =>
                            updateProduct(index, { minBidPrice: Number(e.target.value) || 0 })
                          }
                          className={inputBase}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={row.selectedForLive}
                            onChange={(e) =>
                              updateProduct(index, { selectedForLive: e.target.checked })
                            }
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-xs text-slate-600 dark:text-slate-300">
                            Selected for live
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                          Price increment presets (value:label)
                        </label>
                        <ul className="mb-1 space-y-1">
                          {row.price_increment_presets.map((entry, presetIndex) => {
                            const [v, l] = entry.split(':')
                            return (
                              <li
                                key={presetIndex}
                                className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                              >
                                <span>
                                  {v}: {l}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removePreset(index, presetIndex)}
                                  className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-600 dark:hover:bg-slate-600"
                                  aria-label="Remove preset"
                                >
                                  <Icon icon="material-symbols:close" className="h-3.5 w-3.5" />
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                        <AddPresetForm
                          onAdd={(value, label) => addPreset(index, value, label)}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
                disabled={createAuctionWithProducts.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {createAuctionWithProducts.isPending ? (
                  <>
                    <Icon icon="material-symbols:progress-activity" className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:add" className="h-5 w-5" />
                    Create auction
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CreateProductDrawer
        open={createProductDrawerOpen}
        onClose={() => setCreateProductDrawerOpen(false)}
        onSuccess={handleCreateProductSuccess}
      />
    </>
  )
}
