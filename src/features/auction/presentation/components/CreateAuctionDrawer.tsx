import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn, DateTimeField } from '@/core/components'
import { useCreateAuctionWithProducts } from '../hooks'
import { useProducts } from '@/features/products'
import { useVariables } from '@/features/settings/presentation/hooks'
import type { Product } from '@/features/products/domain/entities'
import type { AuctionStatus, AuctionProgress } from '@/features/auction/domain/entities'
import type { CreateAuctionParams } from '@/features/auction/domain/repositories'
import type { Variable } from '@/features/settings/domain/entities'
import { SelectAuctionProductsModal } from './SelectAuctionProductsModal'

const DEFAULT_AUCTION_START_TIME_KEY = 'default_auction_start_time'
const DEFAULT_VOTING_END_TIME_KEY = 'default_voting_end_time'
const DEFAULT_AUCTION_LIVE_START_TIME_KEY = 'default_auction_live_start_time'

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

const pad2 = (n: number) => String(n).padStart(2, '0')

const defaultStart = () => toLocalDateTime(new Date().toISOString())
const defaultVotingEnd = () => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return toLocalDateTime(d.toISOString())
}

/** Parse time-only from variable value (HH:mm or HH:mm:ss) or extract from ISO string; no timezone conversion. */
function parseTimeFromVariable(raw: string): string {
  const s = raw.trim()
  if (!s) return ''
  const timeOnlyMatch = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (timeOnlyMatch) {
    const h = Math.min(23, Math.max(0, parseInt(timeOnlyMatch[1], 10)))
    const m = Math.min(59, Math.max(0, parseInt(timeOnlyMatch[2], 10)))
    return `${pad2(h)}:${pad2(m)}`
  }
  const isoTimeMatch = s.match(/T(\d{1,2}):(\d{2})/)
  if (isoTimeMatch) {
    const h = Math.min(23, Math.max(0, parseInt(isoTimeMatch[1], 10)))
    const m = Math.min(59, Math.max(0, parseInt(isoTimeMatch[2], 10)))
    return `${pad2(h)}:${pad2(m)}`
  }
  return ''
}

/** Build YYYY-MM-DDTHH:mm from a local date and HH:mm time string. */
function buildLocalDateTime(date: Date, timeHHmm: string): string {
  const y = date.getFullYear()
  const mo = date.getMonth() + 1
  const d = date.getDate()
  return `${y}-${pad2(mo)}-${pad2(d)}T${timeHHmm}`
}

function getDefaultDatetimesFromVariables(variables: Variable[]): {
  startAt: string
  votingEndAt: string
  liveAuctionStartAt: string
} {
  const getTime = (key: string): string => {
    const v = variables.find((x) => x.id === key || x.attributes?.key === key)
    const raw = v?.attributes?.value
    if (typeof raw !== 'string') return ''
    return parseTimeFromVariable(raw)
  }
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const inSevenDays = new Date(today)
  inSevenDays.setDate(inSevenDays.getDate() + 7)

  const startTime = getTime(DEFAULT_AUCTION_START_TIME_KEY)
  const votingEndTime = getTime(DEFAULT_VOTING_END_TIME_KEY)
  const liveStartTime = getTime(DEFAULT_AUCTION_LIVE_START_TIME_KEY)

  return {
    startAt: startTime ? buildLocalDateTime(today, startTime) : defaultStart(),
    votingEndAt: votingEndTime ? buildLocalDateTime(inSevenDays, votingEndTime) : defaultVotingEnd(),
    liveAuctionStartAt: liveStartTime ? buildLocalDateTime(today, liveStartTime) : '',
  }
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
        className={cn(inputBase, 'w-auto shrink-0')}
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

function getInitialFormState(defaults?: {
  startAt: string
  votingEndAt: string
  liveAuctionStartAt: string
}): {
  title: string
  description: string
  startAt: string
  votingEndAt: string
  liveAuctionStartAt: string
  status: AuctionStatus
  progress: AuctionProgress
  products: AuctionProductRow[]
} {
  return {
    title: '',
    description: '',
    startAt: defaults?.startAt ?? defaultStart(),
    votingEndAt: defaults?.votingEndAt ?? defaultVotingEnd(),
    liveAuctionStartAt: defaults?.liveAuctionStartAt ?? '',
    status: 'draft' as AuctionStatus,
    progress: 'voting_open' as AuctionProgress,
    products: [],
  }
}

export function CreateAuctionDrawer({ open, onClose, onSuccess }: CreateAuctionDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState(getInitialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [selectProductsModalOpen, setSelectProductsModalOpen] = useState(false)

  const createAuctionWithProducts = useCreateAuctionWithProducts()
  const { data: productsData, isLoading: productsLoading } = useProducts()
  const { data: variablesData } = useVariables()
  const products = productsData?.products ?? []
  const variables = variablesData?.variables ?? []

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const defaultDatetimes = getDefaultDatetimesFromVariables(variables)
      setForm(getInitialFormState(defaultDatetimes))
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
    const liveAuctionStartAt = form.liveAuctionStartAt ? toISO(form.liveAuctionStartAt) : null

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
      liveAuctionStartAt,
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
              <DateTimeField
                value={form.startAt}
                onChange={(v) => setForm((f) => ({ ...f, startAt: v }))}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Voting end at <span className="text-red-500">*</span>
              </label>
              <DateTimeField
                value={form.votingEndAt}
                onChange={(v) => setForm((f) => ({ ...f, votingEndAt: v }))}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Live auction start at
              </label>
              <DateTimeField
                value={form.liveAuctionStartAt}
                onChange={(v) => setForm((f) => ({ ...f, liveAuctionStartAt: v }))}
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
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Auction products
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectProductsModalOpen(true)}
                  disabled={productsLoading}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
                >
                  <Icon icon="material-symbols:add" className="h-4 w-4" />
                  Add product
                </button>
              </div>
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
                        <ul className="mb-1 space-y-2">
                          {row.price_increment_presets.map((entry, presetIndex) => {
                            const [v = '', l = ''] = entry.split(':')
                            return (
                              <li
                                key={presetIndex}
                                className="flex flex-wrap items-center gap-2"
                              >
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  placeholder="Value"
                                  value={v}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    updateProduct(index, {
                                      price_increment_presets: row.price_increment_presets.map(
                                        (ent, j) => (j === presetIndex ? `${val}:${l}` : ent)
                                      ),
                                    })
                                  }}
                                  className={cn(inputBase, 'w-20')}
                                />
                                <input
                                  type="text"
                                  placeholder="Label"
                                  value={l}
                                  onChange={(e) => {
                                    const lbl = e.target.value
                                    updateProduct(index, {
                                      price_increment_presets: row.price_increment_presets.map(
                                        (ent, j) => (j === presetIndex ? `${v}:${lbl}` : ent)
                                      ),
                                    })
                                  }}
                                  className={cn(inputBase, 'min-w-0 flex-1')}
                                />
                                <button
                                  type="button"
                                  onClick={() => removePreset(index, presetIndex)}
                                  className={cn(inputBase, 'w-9 shrink-0 p-0 flex items-center justify-center text-slate-500 hover:text-red-600 dark:hover:text-slate-400 dark:hover:text-red-400')}
                                  aria-label="Remove preset"
                                >
                                  <Icon icon="material-symbols:close" className="h-4 w-4" />
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

      <SelectAuctionProductsModal
        open={selectProductsModalOpen}
        onClose={() => setSelectProductsModalOpen(false)}
        products={products}
        selectedRows={form.products}
        onApply={(rows) => setForm((f) => ({ ...f, products: rows }))}
        onProductCreated={addProductRow}
        loading={productsLoading}
      />
    </>
  )
}
