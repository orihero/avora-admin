import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/core/components'
import { useCreateProduct } from '@/features/products'

const inputBase =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500'

/** Auction-product fields returned to parent (productId is set by parent). */
export interface CreateProductDrawerAuctionRow {
  minBidPrice: number
  selectedForLive: boolean
  price_increment_presets: string[]
}

export interface CreateProductDrawerProps {
  open: boolean
  onClose: () => void
  onSuccess: (productId: string, auctionRow: CreateProductDrawerAuctionRow) => void
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

function getInitialFormState(): {
  name: string
  brand: string
  price: number
  imageUrl: string
  backgroundColorHex: string
  categoryId: string
  minBidPrice: number
  selectedForLive: boolean
  price_increment_presets: string[]
} {
  return {
    name: '',
    brand: '',
    price: 0,
    imageUrl: '',
    backgroundColorHex: '',
    categoryId: '',
    minBidPrice: 0,
    selectedForLive: false,
    price_increment_presets: [],
  }
}

export function CreateProductDrawer({ open, onClose, onSuccess }: CreateProductDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [form, setForm] = useState(getInitialFormState)
  const [validationError, setValidationError] = useState<string | null>(null)

  const createProduct = useCreateProduct()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setForm(getInitialFormState())
      setValidationError(null)
      createProduct.reset()
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

    const name = form.name.trim()
    if (!name) {
      setValidationError('Product name is required.')
      return
    }
    const brand = form.brand.trim()
    if (!brand) {
      setValidationError('Brand is required.')
      return
    }
    if (form.price < 0) {
      setValidationError('Price must be >= 0.')
      return
    }
    const imageUrl = form.imageUrl.trim()
    if (!imageUrl) {
      setValidationError('Image URL is required.')
      return
    }
    if (form.minBidPrice < 0) {
      setValidationError('Min bid price must be >= 0.')
      return
    }

    createProduct.mutate(
      {
        name,
        brand,
        price: form.price,
        imageUrl,
        backgroundColorHex: form.backgroundColorHex.trim() || null,
        category: form.categoryId.trim() || null,
        auctionRelated: true,
      },
      {
        onSuccess: (product) => {
          onSuccess(product.id, {
            minBidPrice: form.minBidPrice,
            selectedForLive: form.selectedForLive,
            price_increment_presets: form.price_increment_presets,
          })
          onClose()
        },
      }
    )
  }

  if (!open) return null

  const errorMessage = validationError ?? createProduct.error?.message ?? null

  return (
    <>
      <div
        role="presentation"
        className={cn(
          'fixed inset-0 z-[60] bg-slate-900/50 transition-opacity duration-200',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-product-drawer-title"
        className={cn(
          'fixed inset-y-0 right-0 z-[70] flex w-[40vw] flex-col',
          'bg-white shadow-xl dark:bg-slate-800',
          'transform transition-transform duration-200 ease-out',
          mounted ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2
            id="create-product-drawer-title"
            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            Create product
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200"
              >
                {errorMessage}
              </div>
            )}

            <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
              <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Product
              </h3>
              <div className="grid gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Product name"
                    className={inputBase}
                    required
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder="Brand"
                    className={inputBase}
                    required
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className={inputBase}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Background color (hex)
                  </label>
                  <input
                    type="text"
                    value={form.backgroundColorHex}
                    onChange={(e) => setForm((f) => ({ ...f, backgroundColorHex: e.target.value }))}
                    placeholder="#ffffff"
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Category ID
                  </label>
                  <input
                    type="text"
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    placeholder="Optional"
                    className={inputBase}
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
              <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Auction product
              </h3>
              <div className="grid gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Min bid price
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.minBidPrice}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, minBidPrice: Number(e.target.value) || 0 }))
                    }
                    className={inputBase}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.selectedForLive}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, selectedForLive: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      Selected for live
                    </span>
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Price increment presets (value:label)
                  </label>
                  <ul className="mb-1 space-y-1">
                    {form.price_increment_presets.map((entry, presetIndex) => {
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
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                price_increment_presets: f.price_increment_presets.filter(
                                  (_, j) => j !== presetIndex
                                ),
                              }))
                            }
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
                    onAdd={(value, label) =>
                      setForm((f) => ({
                        ...f,
                        price_increment_presets: [...f.price_increment_presets, `${value}:${label}`],
                      }))
                    }
                  />
                </div>
              </div>
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
                disabled={createProduct.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {createProduct.isPending ? (
                  <>
                    <Icon icon="material-symbols:progress-activity" className="h-5 w-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Icon icon="material-symbols:add" className="h-5 w-5" />
                    Create product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
